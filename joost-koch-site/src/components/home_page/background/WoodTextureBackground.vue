<template lang="pug">
.container#woodContainer
    canvas#glCanvas

</template>

<script>
// Data 


// Components


export default {
    name: 'WoodTextureBackground',
    components: {

    },
    props: {
        settings: {
            type: Object,
            default: () => ({
                layerCount: 12,
                maxHeight: 1.4,
                baseColor: 0.2,
                maxColor: 0.5,
                bezelHeight: 7,
                bezelColor: "#551A00",
                sineAmplitude: 0.5,
                sineFase: 0,
                sineFrequency: 2,
                baseSineHeight: 0,
                gaussianBasePositions: [],
                mouseSigmaX: 0.05,
                mouseSigmaY: 0.05,
                mouseMagnitude: 0.5,
            })
        },
        canvasHeight: {
            type: [Number, String],
            default: 300 // Default to 300px, window.innerHeight can cause issues during SSR or if window is not available
        }
    },
    emits: [],
    setup() {

    },
    data() {
        return {
            gl: null,
            shaderProgram: null,
            vertexPosition: null,
            positionBuffer: null,
            positions: [
                1.0, 1.0,
                -1.0, 1.0,
                1.0, -1.0,
                -1.0, -1.0
            ],
            sigmaX: 0.1,
            sigmaY: 0.2,
            magnitude: 0.5,
            sampleCount: 5,
            sampleHeights: [],
            sampleColors: [],
            bezelHeight: 10,
            bezelColor: [0.133, 0.133, 0.133],
            sineAmplitude: 0.3,
            sineFase: 0,
            sineFrequency: 4,
            baseSineHeight: 0,
            gaussianAmount: 0,
            gaussianX: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
            gaussianY: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
            gaussianSigmaX: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
            gaussianSigmaY: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
            gaussianMagnitude: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
            cursorUV: [0, 0],
            mouseFollowerSigmaX: 0.05,
            mouseFollowerSigmaY: 0.05,
            mouseFollowerMagnitude: 0.5,
            mousePosition: [0.5, 0.5],
            baseColorVal: 0.1,
            maxColorVal: 1,
            originalGaussianPositions: []
        }
    },
    computed: {

    },
    methods: {
        initShaderProgram(gl, vsSource, fsSource) {
            const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vsSource);
            const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fsSource);

            const shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
                return null;
            }

            return shaderProgram;
        },

        createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        },
        updateUniforms() {
            if (!this.gl || !this.shaderProgram) return;
            const gl = this.gl;
            const shaderProgram = this.shaderProgram;

            const sigmaXLocation = gl.getUniformLocation(shaderProgram, "sigmaX");
            const sigmaYLocation = gl.getUniformLocation(shaderProgram, "sigmaY");
            const magnitudeLocation = gl.getUniformLocation(shaderProgram, "magnitude");
            const sampleCountLocation = gl.getUniformLocation(shaderProgram, "sampleCount");
            const sampleHeightsLocation = gl.getUniformLocation(shaderProgram, "sampleHeights");
            const sampleColorsLocation = gl.getUniformLocation(shaderProgram, "sampleColors");
            const bezelHeightLocation = gl.getUniformLocation(shaderProgram, "bezelHeight");
            const bezelColorLocation = gl.getUniformLocation(shaderProgram, "bezelColor");
            const sineAmplitudeLocation = gl.getUniformLocation(shaderProgram, "sineAmplitude");
            const sineFaseLocation = gl.getUniformLocation(shaderProgram, "sineFase");
            const sineFrequencyLocation = gl.getUniformLocation(shaderProgram, "sineFrequency");
            const baseSineHeightLocation = gl.getUniformLocation(shaderProgram, "u_baseSineHeight");
            const gaussianAmountLocation = gl.getUniformLocation(shaderProgram, "gaussianAmount");
            const gaussianXLocation = gl.getUniformLocation(shaderProgram, "gaussianX");
            const gaussianYLocation = gl.getUniformLocation(shaderProgram, "gaussianY");
            const gaussianSigmaXLocation = gl.getUniformLocation(shaderProgram, "gaussianSigmaX");
            const gaussianSigmaYLocation = gl.getUniformLocation(shaderProgram, "gaussianSigmaY");
            const gaussianMagnitudeLocation = gl.getUniformLocation(shaderProgram, "gaussianMagnitude");
            const cursorUVLocation = gl.getUniformLocation(shaderProgram, "cursorUV");
            const mouseFollowerSigmaXLocation = gl.getUniformLocation(shaderProgram, "mouseFollowerSigmaX");
            const mouseFollowerSigmaYLocation = gl.getUniformLocation(shaderProgram, "mouseFollowerSigmaY");
            const mouseFollowerMagnitudeLocation = gl.getUniformLocation(shaderProgram, "mouseFollowerMagnitude");
            const mousePositionLocation = gl.getUniformLocation(shaderProgram, "mousePosition");

            gl.uniform1f(sigmaXLocation, this.sigmaX);
            gl.uniform1f(sigmaYLocation, this.sigmaY);
            gl.uniform1f(magnitudeLocation, this.magnitude);
            gl.uniform1i(sampleCountLocation, this.sampleCount);
            gl.uniform1fv(sampleHeightsLocation, this.sampleHeights);
            //Create a temporary array with the length of sampleColors
            let colorArray = [];
            for (let i = 0; i < 40; i++) {
                if (this.sampleColors[i])
                    colorArray.push(...this.sampleColors[i]);
                else
                    colorArray.push(0, 0, 0);
            }
            gl.uniform3fv(sampleColorsLocation, colorArray);

            gl.uniform1f(bezelHeightLocation, this.bezelHeight / 100);
            gl.uniform3fv(bezelColorLocation, this.bezelColor);
            gl.uniform1f(sineAmplitudeLocation, this.sineAmplitude);
            gl.uniform1f(sineFaseLocation, this.sineFase);
            gl.uniform1f(sineFrequencyLocation, this.sineFrequency);
            gl.uniform1f(baseSineHeightLocation, this.baseSineHeight);
            gl.uniform1i(gaussianAmountLocation, this.gaussianAmount);
            gl.uniform1fv(gaussianXLocation, this.gaussianX);
            gl.uniform1fv(gaussianYLocation, this.gaussianY);
            gl.uniform1fv(gaussianSigmaXLocation, this.gaussianSigmaX);
            gl.uniform1fv(gaussianSigmaYLocation, this.gaussianSigmaY);
            gl.uniform1fv(gaussianMagnitudeLocation, this.gaussianMagnitude);
            gl.uniform2fv(cursorUVLocation, this.cursorUV);
            gl.uniform1f(mouseFollowerSigmaXLocation, this.mouseFollowerSigmaX);
            gl.uniform1f(mouseFollowerSigmaYLocation, this.mouseFollowerSigmaY);
            gl.uniform1f(mouseFollowerMagnitudeLocation, this.mouseFollowerMagnitude);
            gl.uniform2fv(mousePositionLocation, this.mousePosition);
        },
        calculateGaussian(uv, center, gaussianSigmaX, gaussianSigmaY, gaussianMagnitude) {
            const exponent = -((Math.pow(uv[0] - center[0], 2) / (2 * Math.pow(gaussianSigmaX, 2))) + (Math.pow(uv[1] - center[1], 2) / (2 * Math.pow(gaussianSigmaY, 2))));
            return gaussianMagnitude * Math.exp(exponent);
        },
        calculateTotalHeight(uv) {
            let totalGaussian = 0;
            for (let i = 0; i < 11; i++) {
                if (i < this.gaussianAmount) {
                    const center = [this.gaussianX[i], this.gaussianY[i]];
                    const gaussianValue = this.calculateGaussian(uv, center, this.gaussianSigmaX[i], this.gaussianSigmaY[i], this.gaussianMagnitude[i]);
                    totalGaussian += gaussianValue;
                }
            }
            let sine = Math.sin(uv[1] * this.sineFrequency * 6.28318530718 + this.sineFase);
            let baseHeight = this.sineAmplitude * sine * sine + this.baseSineHeight;
            let mouseFollower = this.calculateGaussian(uv, this.mousePosition, this.mouseFollowerSigmaX, this.mouseFollowerSigmaY, this.mouseFollowerMagnitude);
            return totalGaussian + baseHeight + mouseFollower;
        },
        calculateBrownColor(grayValue) {
            // Map grayscale (0-1) to brown shades
            const r = 0.4 + 0.5 * (grayValue * 0.6); // Red component
            const g = 0.1 + 0.5 * (grayValue * 0.5);  // Green component
            const b = 0.02 + 0.5 * (grayValue * 0.18);    // Blue component
            return [r, g, b];
        },
        calculateSamples() {

            const layerCount = this.settings.layerCount
            const maxHeight = this.settings.maxHeight
            const baseColor = this.baseColorVal;
            this.bezelHeight = this.settings.bezelHeight
            this.sampleCount = layerCount * 2 + 1;
            const bezelOffset = (1 - (this.bezelHeight / 100)) * (maxHeight / layerCount);
            this.sampleHeights = [0.1];
            this.sampleColors = [this.calculateBrownColor(baseColor)];
            const totalColorDelta = (1 - baseColor);

            for (let i = 0; i < layerCount; i++) {
                const heightValue = (maxHeight / layerCount) * (i + 1);

                // Bezel Color
                this.sampleHeights.push(heightValue);
                this.sampleColors.push(this.bezelColor);

                // Layer Color
                this.sampleHeights.push(heightValue + bezelOffset);
                let colorValue = baseColor + (totalColorDelta * (heightValue / maxHeight));
                this.sampleColors.push(this.calculateBrownColor(colorValue));

            }
            this.sampleHeights.sort((a, b) => a - b);

        },
        initRandomGaussians() {
            const amount = 5;
            for (let i = 0; i < amount; i++) {
                this.gaussianX[i] = Math.random();
                this.gaussianY[i] = Math.random();
                this.gaussianSigmaX[i] = Math.random() * 0.1 + 0.05;
                this.gaussianMagnitude[i] = Math.random() * 0.5 + 0.2;
                this.gaussianSigmaY[i] = Math.random() * this.gaussianMagnitude[i] * 0.03 + 0.05;
                this.gaussianAmount++;
            }

            const outside_amount = 4;
            for (let i = amount; i < outside_amount+amount; i++) {

                const sign = (i-amount) < ((outside_amount) / 2) ? -1 : 1;

                this.gaussianX[i] = 0.5 + sign ;
                this.gaussianY[i] = 0.5 + sign * 0.7;

                // console.log(this.gaussianX[i],this.gaussianY[i])
                this.gaussianSigmaX[i] = 0.5;
                this.gaussianMagnitude[i] = 0.4;
                this.gaussianSigmaY[i] = 0.5;
                this.gaussianAmount++;
            }

            this.originalGaussianPositions = this.gaussianX.map((x, i) => ({ x: x, y: this.gaussianY[i] }))
            this.updateUniforms();
        },
        setSettings(){
            const newVal = this.settings

            this.baseColorVal = newVal.baseColor;
            this.maxColorVal = newVal.maxColor;
            this.bezelColor = [parseInt(newVal.bezelColor.slice(1, 3), 16) / 255,
            parseInt(newVal.bezelColor.slice(3, 5), 16) / 255,
            parseInt(newVal.bezelColor.slice(5, 7), 16) / 255];
            this.sineAmplitude = newVal.sineAmplitude;
            this.sineFase = newVal.sineFase;
            this.sineFrequency = newVal.sineFrequency;
            this.baseSineHeight = newVal.baseSineHeight;
            this.mouseFollowerSigmaX = newVal.mouseSigmaX;
            this.mouseFollowerSigmaY = newVal.mouseSigmaY;
            this.mouseFollowerMagnitude = newVal.mouseMagnitude;


            this.gaussianX = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
            this.gaussianY = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
            this.gaussianSigmaX = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];
            this.gaussianSigmaY = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];
            this.gaussianMagnitude = [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3];
            this.gaussianAmount = 0;
            if (newVal.gaussianBasePositions.length > 0) {
                for (let i = 0; i < newVal.gaussianBasePositions.length; i++) {
                    if (i < 10) {
                        this.gaussianX[i] = newVal.gaussianBasePositions[i].x;
                        this.gaussianY[i] = newVal.gaussianBasePositions[i].y;
                        this.gaussianSigmaX[i] = newVal.gaussianBasePositions[i].sigmaX ? newVal.gaussianBasePositions[i].sigmaX : 0.1;
                        this.gaussianSigmaY[i] = newVal.gaussianBasePositions[i].sigmaY ? newVal.gaussianBasePositions[i].sigmaY : 0.1;
                        this.gaussianMagnitude[i] = newVal.gaussianBasePositions[i].magnitude ? newVal.gaussianBasePositions[i].magnitude : 0.3;
                        this.gaussianAmount++;
                    }

                }
            }
            this.originalGaussianPositions = this.gaussianX.map((x, i) => ({ x: x, y: this.gaussianY[i] }))


            this.calculateSamples();
            this.updateUniforms();
        }
    },
    watch: {
        settings: {
            handler(newVal) {
                this.setSettings()
            },
            deep: true,
        },
        canvasHeight: {
            handler() {
                if (this.gl) { // Ensure WebGL context is initialized
                    this.resizeCanvas();
                }
            }
        }
    },
    // created() {

    // },
    mounted() {
        this.setSettings()
        const container = document.getElementById('woodContainer')
        const glCanvas = document.getElementById('glCanvas');
        this.gl = glCanvas.getContext('webgl');
        const gl = this.gl;

        if (!gl) {
            alert('Unable to initialize WebGL. Your browser may not support it.');
            return;
        }

        // Shader source code
        const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
          gl_Position = aVertexPosition;
        }
      `;

        const fsSource = `
        precision mediump float;
        uniform vec2 iResolution;
        uniform float sigmaX;
        uniform float sigmaY;
        uniform float magnitude;
        uniform int sampleCount;
        uniform float sampleHeights[40];
        uniform vec3 sampleColors[40];
        uniform float bezelHeight;
        uniform vec3 bezelColor;
        uniform float sineAmplitude;
        uniform float sineFase;
        uniform float sineFrequency;
        uniform float u_baseSineHeight;
         uniform int gaussianAmount;
        uniform float gaussianX[11];
        uniform float gaussianY[11];
        uniform float gaussianSigmaX[11];
        uniform float gaussianSigmaY[11];
        uniform float gaussianMagnitude[11];
        uniform vec2 cursorUV;
        uniform float mouseFollowerSigmaX;
         uniform float mouseFollowerSigmaY;
          uniform float mouseFollowerMagnitude;
          uniform vec2 mousePosition;
        
       
         float calculateGaussian(vec2 uv, vec2 center,float gaussianSigmaX,float gaussianSigmaY,float gaussianMagnitude) {
             float exponent = -((pow(uv.x - center.x, 2.0) / (2.0 * pow(gaussianSigmaX, 2.0))) + (pow(uv.y - center.y, 2.0) / (2.0 * pow(gaussianSigmaY, 2.0))));
            return gaussianMagnitude * exp(exponent);
        }

       float calculateTotalGaussian(vec2 uv){
            float totalGaussian = 0.0;
            for(int i = 0; i < 11; i++){
                if(i < gaussianAmount){
                    vec2 center = vec2(gaussianX[i], gaussianY[i]);
                    totalGaussian += calculateGaussian(uv,center,gaussianSigmaX[i],gaussianSigmaY[i],gaussianMagnitude[i]);
                }
            }
            return totalGaussian;
       }

         float calculateMouseFollower(vec2 uv){
            return calculateGaussian(uv,mousePosition,mouseFollowerSigmaX,mouseFollowerSigmaY,mouseFollowerMagnitude);
        }

        float calculateBaseHeight(vec2 uv){
            float sine = sin(uv.y * sineFrequency* 6.28318530718 + sineFase);
            return sineAmplitude * sine * sine + u_baseSineHeight;
        }
        vec3 calculateColor(vec2 uv){
            float totalGaussian = calculateTotalGaussian(uv);
            float baseHeight = calculateBaseHeight(uv);
           float mouseFollower = calculateMouseFollower(uv);
            float totalHeight = totalGaussian + baseHeight + mouseFollower;
             vec3 finalColor = vec3(0.0);
            for(int i = 0; i < 40; i++){
                if(i < sampleCount){
                     float sampleHeight = sampleHeights[i];
                    if(totalHeight < sampleHeight || i == sampleCount - 1){
                        finalColor = sampleColors[i];
                        return finalColor;
                    }
                }
            }
            return vec3(0.0);
        }
      
      void main() {
             vec3 finalColor = calculateColor(gl_FragCoord.xy / iResolution.xy);
               
            gl_FragColor = vec4(finalColor, 1.0);
        }
        `;

        // Initialize shader program
        this.shaderProgram = this.initShaderProgram(gl, vsSource, fsSource);
        this.gl.useProgram(this.shaderProgram)

        // Get vertex position attribute location
        this.vertexPosition = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        // Create buffer
        this.positionBuffer = gl.createBuffer();

        // Create vertex position data
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

        this.calculateSamples();

        if (this.settings.gaussianBasePositions.length == 0) this.initRandomGaussians();

        

        container.addEventListener('mousemove', (event) => {
            
            const rect = glCanvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            const uvX = mouseX / glCanvas.width;
            const uvY = 1 - (mouseY / glCanvas.height);
            this.mousePosition = [uvX, uvY];
            this.cursorUV = [uvX, uvY];
            this.updateUniforms()
        });
        // Resize canvas
        this.resizeCanvas = () => { // Assign to this to make it accessible in watcher
            const glCanvas = document.getElementById('glCanvas'); // Ensure glCanvas is defined in this scope
            if (!glCanvas || !this.gl) return; // Guard against missing canvas or GL context

            glCanvas.width = window.innerWidth; // Keep width responsive for now, or make it a prop too
            
            let newHeight = this.canvasHeight;
            if (typeof newHeight === 'string') {
                if (newHeight.endsWith('px')) {
                    newHeight = parseInt(newHeight, 10);
                } else if (newHeight.endsWith('vh')) {
                    newHeight = window.innerHeight * (parseInt(newHeight, 10) / 100);
                } else if (newHeight.endsWith('%')) {
                    // Assuming parent container for percentage height, which might be tricky with canvas
                    // For simplicity, let's assume direct assignment or pixel/vh values are primary
                    // Fallback or specific logic might be needed for robust percentage handling
                    const parentHeight = glCanvas.parentElement ? glCanvas.parentElement.clientHeight : window.innerHeight;
                    newHeight = parentHeight * (parseInt(newHeight, 10) / 100);
                } else {
                    // If it's a string but not 'px' or 'vh', try to parse as number, or use as is if browser supports
                    const parsed = parseInt(newHeight, 10);
                    if (!isNaN(parsed)) {
                        newHeight = parsed;
                    }
                }
            }
            
            glCanvas.height = newHeight;

            this.gl.viewport(0, 0, glCanvas.width, glCanvas.height);
            const resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, 'iResolution')
            this.gl.uniform2f(resolutionLocation, glCanvas.width, glCanvas.height);
            this.calculateSamples();
            this.updateUniforms();
        }

        window.addEventListener('resize', this.resizeCanvas);
        this.resizeCanvas();

        // Rendering loop
        const render = () => {
            for (let i = 0; i < this.gaussianAmount; i++) {
                const dx = this.gaussianX[i] - this.mousePosition[0];
                const dy = this.gaussianY[i] - this.mousePosition[1];
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 0.3) {
                    const repulsionStrength = -0.01 * ( (distance - 0.3) / 0.3 )
                    this.gaussianX[i] += dx * repulsionStrength;
                    this.gaussianY[i] += dy * repulsionStrength;
                    continue
                }

                const originalX = this.originalGaussianPositions[i].x;
                const originalY = this.originalGaussianPositions[i].y;
                const dxOriginal = this.gaussianX[i] - originalX;
                const dyOriginal = this.gaussianY[i] - originalY;
                const distanceOriginal = Math.sqrt(dxOriginal * dxOriginal + dyOriginal * dyOriginal);
                const returnSpeed = 0.05;
                if (distanceOriginal > 0.2) {
                    this.gaussianX[i] += (originalX - this.gaussianX[i]) * returnSpeed * 0.5;
                    this.gaussianY[i] += (originalY - this.gaussianY[i]) * returnSpeed * 0.5;
                }
                else if (distanceOriginal > 0.01) {
                    this.gaussianX[i] += (originalX - this.gaussianX[i]) * returnSpeed;
                    this.gaussianY[i] += (originalY - this.gaussianY[i]) * returnSpeed;
                } else {
                    this.gaussianX[i] = originalX;
                    this.gaussianY[i] = originalY;
                }


            }
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.enableVertexAttribArray(this.vertexPosition);
            gl.vertexAttribPointer(this.vertexPosition, 2, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            this.updateUniforms();
            requestAnimationFrame(render);
        }


        requestAnimationFrame(render);

    },


}
</script>

<style scoped>


canvas {
    display: block;
}
</style>