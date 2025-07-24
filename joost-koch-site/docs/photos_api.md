Of course. Excellent documentation is key for any API.

Here is a comprehensive `api_docs.md` file written in Markdown. This document explains how to use the Google Cloud Function API you just created, covering the endpoint, parameters, response formats, and examples.

---

# Google Photos Album Scraper API Documentation

## Overview

This API provides a simple, serverless way to extract high-resolution image data from a public Google Photos album share link. It scrapes the album's HTML content to find direct image URLs, their maximum resolutions, and aspect ratios.

This allows developers to dynamically fetch and display images from a Google Photos album without needing to use the official (and more complex) Google Photos API and OAuth authentication.

## Endpoint

There is a single endpoint available to fetch album data.

### Get Album Images

Retrieves a list of all images found in a specified Google Photos album.

`GET /?url=<album_url>`

**Base URL:** `https://<your-region>-<your-project-id>.cloudfunctions.net/get_google_photos_api`

---

### Query Parameters

The endpoint accepts the following query parameter:

| Parameter | Required | Type   | Description                                                     |
| :-------- | :------- | :----- | :-------------------------------------------------------------- |
| `url`     | **Yes**  | String | The full, public share URL of the Google Photos album to scrape. |

**Example:** `?url=https://photos.app.goo.gl/aKcKBqgmSJwcQraN9`

---

### Responses

#### ► Successful Response (200 OK)

If the album URL is valid and the data is successfully scraped, the API will return a `200 OK` status with a JSON array in the response body. Each object in the array represents one image.

**Response Body Structure:**
Each image object contains the following fields:

| Field          | Type   | Description                                                                                                    |
| :------------- | :----- | :------------------------------------------------------------------------------------------------------------- |
| `id`           | String | A unique identifier for the media item within Google Photos.                                                   |
| `base_url`     | String | The base URL for the image. This URL can be appended with parameters to control image size. See notes below.   |
| `max_width`    | Number | The maximum available width of the image in pixels.                                                            |
| `max_height`   | Number | The maximum available height of the image in pixels.                                                           |
| `aspect_ratio` | Number | The calculated aspect ratio (width / height), rounded to two decimal places.                                   |
| `full_res_url` | String | A pre-constructed URL to fetch the image at its maximum available resolution.                                  |

**Example JSON Response:**

```json
[
  {
    "id": "AF1QipP0b4jaLpBdagbMUDdbV1rSJJcYo4bOX4XPTNTd",
    "base_url": "https://lh3.googleusercontent.com/pw/AP1GczN5pE_wV2vp9MOcYy-5KHYs5dN3DExsb-kSD9Om8Vx9Wsdnp6sl4PJwWkX9qFoPgxqkVBWnVUn721GHzWbm2bO8sGs7kWvEfp_b7XfijbCMSvFAyjyx",
    "max_width": 1388,
    "max_height": 2781,
    "aspect_ratio": 0.5,
    "full_res_url": "https://lh3.googleusercontent.com/pw/AP1GczN5pE_wV2vp9MOcYy-5KHYs5dN3DExsb-kSD9Om8Vx9Wsdnp6sl4PJwWkX9qFoPgxqkVBWnVUn721GHzWbm2bO8sGs7kWvEfp_b7XfijbCMSvFAyjyx=w1388-h2781"
  },
  {
    "id": "AF1QipOlxeAVph1VGf1xQo9itHEkQxUuqt6vCzOPZZUi",
    "base_url": "https://lh3.googleusercontent.com/pw/AP1GczNAOeEjsQAPFweyFln13SqVk_BEImqfzagFqlXMCl0EpjgQ9QafTl-c8N9sC0LL2zq_m0r7jJU2hoQ0kOF-x7VD4thKrDqa2Q0Vg4EBMCy9nFurlY7M",
    "max_width": 5184,
    "max_height": 2916,
    "aspect_ratio": 1.78,
    "full_res_url": "https://lh3.googleusercontent.com/pw/AP1GczNAOeEjsQAPFweyFln13SqVk_BEImqfzagFqlXMCl0EpjgQ9QafTl-c8N9sC0LL2zq_m0r7jJU2hoQ0kOF-x7VD4thKrDqa2Q0Vg4EBMCy9nFurlY7M=w5184-h2916"
  }
]
```

#### ► Error Responses

If the request fails, the API will return a relevant HTTP status code and a JSON object containing an error message.

**400 Bad Request** - The request was malformed.
*   **Cause:** The `url` query parameter was missing or the provided URL was not a valid Google Photos album link.
*   **Response Body:**
    ```json
    {
      "error": "The \"url\" query parameter is required."
    }
    ```

**500 Internal Server Error** - A server-side error occurred.
*   **Cause:** The API was unable to fetch the album page or could not find the image data within the HTML. This usually happens if Google changes the structure of their photo album pages.
*   **Response Body:**
    ```json
    {
      "error": "Failed to retrieve or parse album data."
    }
    ```

---

## How to Use the Image URLs

The `base_url` for each image can be dynamically modified by appending parameters to generate different image sizes. This is a powerful feature for creating responsive image galleries.

*   **Set width:** `=w<width>` (e.g., `=w800`). Height will be scaled automatically.
*   **Set height:** `=h<height>` (e.g., `=h600`). Width will be scaled automatically.
*   **Set width and height:** `=w<width>-h<height>` (e.g., `=w800-h600`). This will fit the image within the box, preserving aspect ratio.
*   **Square crop:** `=s<size>` (e.g., `=s256`). This will create a centered square crop of the specified size. Perfect for thumbnails.

**Example using a `base_url`:**
`https://lh3.googleusercontent.com/pw/AP1GczN5pE_wV2vp9MOcYy...`

*   `...=w500` -> Image with a width of 500px.
*   `...=h200` -> Image with a height of 200px.
*   `...=s128` -> A 128x128px square thumbnail.

---

## Example Usage (`curl`)

Here is a full example of how to call the API from the command line using `curl`.

```bash
curl -X GET "https://luft-photo-requester-234817865209.europe-west4.run.app/get_google_photos_api?url=https://photos.app.goo.gl/aKcKBqgmSJwcQraN9"
```

## Important Disclaimer

This API relies on **web scraping**, not an official, stable API from Google. The structure of the Google Photos HTML pages can change at any time without warning. **If Google updates its website, this function may stop working.** It is recommended to implement robust error handling in any application that consumes this API.