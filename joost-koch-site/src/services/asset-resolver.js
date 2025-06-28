// Use import.meta.glob to find all files under the src/assets directory, recursively.
// The `eager: false` option (default) creates dynamic imports, which is what we need.
const assetModules = import.meta.glob('/src/assets/**/*.*');

// Create a manifest to map clean filenames to their dynamic import functions.
const assetManifest = {};
for (const path in assetModules) {
  // Extract the full filename (e.g., "cv.pdf") from the path.
  const fileNameWithExt = path.split('/').pop();
  // Remove the file extension to get the clean name (e.g., "cv").
  const cleanFileName = fileNameWithExt.substring(0, fileNameWithExt.lastIndexOf('.'));

  // Store the import function in our manifest, keyed by the clean name.
  // This allows for potential duplicate filenames in different folders, the first one found wins.
  // For a more robust solution, you could namespace them or throw an error.
  if (!assetManifest[cleanFileName]) {
    assetManifest[cleanFileName] = assetModules[path];
  }
}

/**
 * Asynchronously resolves a clean filename to its final, hashed asset URL.
 * @param {string} fileName - The name of the file without the extension.
 * @returns {Promise<string|null>} A promise that resolves to the asset URL, or null if not found.
 */
export async function resolveAssetUrl(fileName) {
  if (assetManifest[fileName]) {
    try {
      // Execute the dynamic import function.
      const module = await assetManifest[fileName]();
      // The resolved module's `default` property contains the final URL.
      return module.default;
    } catch (error) {
      console.error(`Error resolving asset: ${fileName}`, error);
      return null;
    }
  }
  // Return null if the filename is not in our manifest.
  return null;
}
