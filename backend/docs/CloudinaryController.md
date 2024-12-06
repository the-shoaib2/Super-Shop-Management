# Cloudinary Controller Documentation

The CloudinaryController handles all image upload and deletion operations using Cloudinary service in the Super Shop Management system.

## Base URL
```
/api/upload
```

## Security
- All endpoints require authentication (`@PreAuthorize("isAuthenticated()")`)
- CORS enabled for configured admin and store frontend URLs

## Endpoints

### 1. Upload Single Image
```http
POST /api/upload/image
```

**Request Parameters:**
- `file` (required) - MultipartFile: The image file to upload
- `folder` (optional) - String: The folder name in Cloudinary where the image should be stored

**Headers:**
- `Content-Type: multipart/form-data`
- Authorization token required

**Response:**
```json
{
    "success": true,
    "message": "Image uploaded successfully",
    "data": {
        "url": "cloudinary_url",
        "publicId": "public_id",
        // other cloudinary metadata
    }
}
```

### 2. Upload Multiple Images
```http
POST /api/upload/images
```

**Request Parameters:**
- `files` (required) - List<MultipartFile>: Multiple image files to upload
- `folder` (optional) - String: The folder name in Cloudinary where the images should be stored

**Headers:**
- `Content-Type: multipart/form-data`
- Authorization token required

**Response:**
```json
{
    "success": true,
    "message": "Images uploaded successfully",
    "data": [
        {
            "url": "cloudinary_url_1",
            "publicId": "public_id_1"
        },
        {
            "url": "cloudinary_url_2",
            "publicId": "public_id_2"
        }
        // ... more images
    ]
}
```

### 3. Delete Image
```http
DELETE /api/upload/image
```

**Query Parameters:**
- `publicId` (required) - String: The public ID of the image to delete from Cloudinary

**Headers:**
- Authorization token required

**Response:**
```json
{
    "success": true,
    "message": "Image deleted successfully",
    "data": {
        "result": "ok"
        // deletion metadata
    }
}
```

## Error Responses
All endpoints return error responses in the following format:
```json
{
    "success": false,
    "message": "Error message description",
    "data": null
}
```

Common error scenarios:
- 401 Unauthorized: When user is not authenticated
- 500 Internal Server Error: When upload/deletion operations fail

## Notes
- All image operations are handled by the CloudinaryService
- Supports various image formats
- Files are automatically optimized by Cloudinary
- Public IDs should be stored for future reference and deletion operations
