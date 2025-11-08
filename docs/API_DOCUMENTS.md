# Document Management API

This documentation describes how to upload, confirm, retrieve, and delete student documents using Firebase Storage integration with presigned URLs.

## Endpoints

### POST /documents/generate-upload-url
Generates a presigned URL for uploading a document to Firebase Storage.

#### Request
```json
{
  "studentId": 123,
  "originalName": "student-report.pdf",
  "contentType": "application/pdf",
  "description": "Q1 2024 Progress Report",
  "createdAt": "2024-11-08T14:30:00Z"
}
```

#### Success Response (200 OK)
```json
{
  "documentId": "550e8400-e29b-41d4-a716-446655440000",
  "url": "https://storage.googleapis.com/your-bucket/user123/550e8400-e29b-41d4-a716-446655440000.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&..."
}
```

#### Possible Errors
- `400 Bad Request` - Invalid request parameters (missing required fields, invalid UUID format)
- `404 Not Found` - Student with the specified `studentId` does not exist

#### Test Examples
```bash
# Successful flow
curl -X POST http://localhost:3000/documents/generate-upload-url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "studentId": 123,
    "originalName": "report.pdf",
    "contentType": "application/pdf",
    "description": "Progress Report",
    "createdAt": "2024-11-08T14:30:00Z"
  }'

# Student not found
curl -X POST http://localhost:3000/documents/generate-upload-url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "studentId": 99999,
    "originalName": "report.pdf",
    "contentType": "application/pdf",
    "description": "Test",
    "createdAt": "2024-11-08T14:30:00Z"
  }'

# Missing required fields
curl -X POST http://localhost:3000/documents/generate-upload-url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "studentId": 123
  }'
```

#### BDD
- **Scenario - Successful URL Generation**  
  Given a valid student with `studentId: 123`  
  When the client sends `POST /documents/generate-upload-url` with valid payload  
  Then the system creates a document record with status `PENDING`  
  And returns `200` with `{ documentId, url }` valid for 15 minutes

- **Scenario - Student Not Found**  
  Given no student exists with `studentId: 99999`  
  When sends `POST /documents/generate-upload-url`  
  Then returns `404 Not Found` with message "The document couldn't be created"

- **Scenario - Invalid Request**  
  Given a payload missing required field `originalName`  
  When sends `POST /documents/generate-upload-url`  
  Then returns `400 Bad Request`

---

### Upload File to Firebase Storage
After generating the presigned URL, upload the actual file to Firebase Storage.

#### Request
```bash
PUT <presigned-url-from-previous-step>
Content-Type: application/pdf
Body: <binary-file-data>
```

#### Success Response (200 OK or 204 No Content)
Empty body - Firebase confirms successful upload

#### Possible Errors
- `403 Forbidden` - URL expired (older than 15 minutes) or invalid signature
- `400 Bad Request` - Content-Type mismatch or invalid file

#### Test Examples
```bash
# Upload using curl
curl -X PUT "<presigned-url>" \
  -H "Content-Type: application/pdf" \
  --data-binary @report.pdf
```

#### BDD
- **Scenario - Successful Upload**  
  Given a valid presigned URL (not expired)  
  When the client uploads a file matching the specified `contentType`  
  Then Firebase Storage stores the file  
  And returns `200` or `204`

- **Scenario - Expired URL**  
  Given a presigned URL older than 15 minutes  
  When tries to upload a file  
  Then returns `403 Forbidden`

---

### POST /documents/confirm-upload
Confirms that a file was successfully uploaded and updates the document status to `COMPLETED`.

#### Request
```json
{
  "fileId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Success Response (204 No Content)
Empty body

#### Possible Errors
- `400 Bad Request` - Invalid UUID format for `fileId`
- `404 Not Found` - Document with the specified `fileId` does not exist in database
- `404 Not Found` - Document exists but file was not uploaded to Firebase Storage

#### Test Examples
```bash
# Successful confirmation
curl -X POST http://localhost:3000/documents/confirm-upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "fileId": "550e8400-e29b-41d4-a716-446655440000"
  }'

# Document not found
curl -X POST http://localhost:3000/documents/confirm-upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "fileId": "00000000-0000-0000-0000-000000000000"
  }'

# File not uploaded (skipped step 2)
curl -X POST http://localhost:3000/documents/confirm-upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "fileId": "<id-without-upload>"
  }'
```

#### BDD
- **Scenario - Successful Confirmation**  
  Given a document with `fileId` exists with status `PENDING`  
  And the file exists in Firebase Storage  
  When sends `POST /documents/confirm-upload` with valid `fileId`  
  Then the system updates document status to `COMPLETED`  
  And returns `204 No Content`

- **Scenario - Document Not Found**  
  Given no document exists with the specified `fileId`  
  When sends `POST /documents/confirm-upload`  
  Then returns `404 Not Found` with message "Document with ID ... could not be found"

- **Scenario - File Not Uploaded**  
  Given a document exists but file was not uploaded to Firebase  
  When sends `POST /documents/confirm-upload`  
  Then returns `404 Not Found` with message "The requested document could not be found in Firebase Storage"

---

### GET /documents/student/:studentId
Retrieves all completed documents for a specific student with presigned read URLs.

#### Path Parameters
- `studentId` (number) - The ID of the student

#### Success Response (200 OK)
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "studentId": 123,
    "originalName": "report.pdf",
    "contentType": "application/pdf",
    "description": "Q1 2024 Progress Report",
    "createdAt": "2024-11-08T14:30:00Z",
    "url": "https://storage.googleapis.com/your-bucket/user123/550e8400...?X-Goog-Algorithm=..."
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "studentId": 123,
    "originalName": "photo.jpg",
    "contentType": "image/jpeg",
    "description": "Profile Photo",
    "createdAt": "2024-11-06T10:30:00Z",
    "url": "https://storage.googleapis.com/your-bucket/user123/660e8400...?X-Goog-Algorithm=..."
  }
]
```

#### Possible Errors
- `400 Bad Request` - Invalid `studentId` format (not a number)
- `404 Not Found` - Student with the specified `studentId` does not exist

#### Test Examples
```bash
# Get all documents for student
curl -X GET http://localhost:3000/documents/student/123 \
  -H "Authorization: Bearer <jwt-token>"

# Student not found
curl -X GET http://localhost:3000/documents/student/99999 \
  -H "Authorization: Bearer <jwt-token>"

# Invalid student ID format
curl -X GET http://localhost:3000/documents/student/abc \
  -H "Authorization: Bearer <jwt-token>"
```

#### BDD
- **Scenario - List Student Documents**  
  Given a student with `studentId: 123` has completed documents  
  When sends `GET /documents/student/123`  
  Then returns `200` with array of documents  
  And each document includes a presigned read URL valid for 60 minutes  
  And only documents with status `COMPLETED` are returned

- **Scenario - Student Not Found**  
  Given no student exists with `studentId: 99999`  
  When sends `GET /documents/student/99999`  
  Then returns `404 Not Found` with message "Student not found"

- **Scenario - No Documents**  
  Given a student with `studentId: 123` has no completed documents  
  When sends `GET /documents/student/123`  
  Then returns `200` with empty array `[]`

- **Scenario - Missing Files Filtered**  
  Given a student has documents but some files are missing from storage  
  When sends `GET /documents/student/123`  
  Then returns `200` with only documents that have valid files  
  And missing files are logged but not exposed to the user

---

### DELETE /documents/:id
Deletes a document record and removes the associated file from Firebase Storage.

#### Path Parameters
- `id` (string) - The UUID of the document to delete

#### Success Response (204 No Content)
Empty body

#### Possible Errors
- `404 Not Found` - Document with the specified `id` does not exist
- `400 Bad Request` - Failed to delete file from Firebase Storage

#### Test Examples
```bash
# Successful deletion
curl -X DELETE http://localhost:3000/documents/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <jwt-token>"

# Document not found
curl -X DELETE http://localhost:3000/documents/00000000-0000-0000-0000-000000000000 \
  -H "Authorization: Bearer <jwt-token>"
```

#### BDD
- **Scenario - Successful Deletion**  
  Given a document exists with `id: "550e8400-..."`  
  When sends `DELETE /documents/550e8400-...`  
  Then the system deletes the file from Firebase Storage  
  And deletes the document record from the database  
  And returns `204 No Content`

- **Scenario - Document Not Found**  
  Given no document exists with the specified `id`  
  When sends `DELETE /documents/{id}`  
  Then returns `404 Not Found` with message "Document not found"

- **Scenario - File Already Deleted**  
  Given a document exists but the file is already deleted from storage  
  When sends `DELETE /documents/{id}`  
  Then the system continues and deletes the database record  
  And returns `204 No Content`

---

## Background Jobs

### Cleanup Pending Documents
Automatically runs daily at 9 PM to remove pending documents older than 24 hours.

#### Behavior
- Finds all documents with status `PENDING` created more than 24 hours ago
- Deletes associated files from Firebase Storage (fails silently for missing files)
- Removes document records from database
- Logs cleanup summary

#### BDD
- **Scenario - Cleanup Old Pending Documents**  
  Given documents exist with status `PENDING` created 25 hours ago  
  When the cron job runs at 9 PM  
  Then files are deleted from Firebase Storage  
  And document records are deleted from database  
  And cleanup summary is logged

- **Scenario - No Old Documents**  
  Given all pending documents were created within the last 24 hours  
  When the cron job runs  
  Then no documents are deleted  
  And logs "No outdated pending documents found"

---

## Complete Upload Flow

1. **Generate Upload URL**: Client requests presigned URL from backend
2. **Upload to Firebase**: Client uploads file directly to Firebase Storage using the URL
3. **Confirm Upload**: Client notifies backend that upload is complete
4. **Retrieve Documents**: Client can now fetch document with read URL
5. **Download/View**: Client uses read URL to access the file

**Key Points:**
- Upload URLs expire after **15 minutes**
- Read URLs expire after **60 minutes**
- Documents have two states: `PENDING` (awaiting upload) and `COMPLETED` (uploaded and confirmed)
- Storage path format: `user{studentId}/{documentId}.{extension}`

---

## Important Notes

- **Authentication**: All endpoints require JWT Bearer token (except Firebase upload step)
- **File Types**: Any file type supported (PDF, images, documents, etc.)
- **Content-Type**: Must match between URL generation and actual upload
- **Error Handling**: Missing files in storage are silently filtered from listings
- **Cleanup**: Pending documents older than 24 hours are automatically deleted daily at 9 PM

---

## Swagger Documentation
After starting the server, interactive documentation is