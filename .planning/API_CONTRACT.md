# API Contract & Communication Specification

### 1. Initiate Conversion Job
* **Endpoint:** `POST /api/v1/conversions`
* **Request Payload:**
```json
{
  "settings": {
    "pageSize": "A4",
    "orientation": "PORTRAIT",
    "dpi": 150
  },
  "files": [
    { "fileName": "page_01.jpg", "mimeType": "image/jpeg", "sizeBytes": 2048576 },
    { "fileName": "page_02.png", "mimeType": "image/png", "sizeBytes": 1048576 }
  ]
}
```

* **Response (201 Created):**
```json
{
  "jobId": "a5d89f4b-22b0-4a81-9b1b-4f9e67a03281",
  "uploadTargets": [
    {
      "sequenceOrder": 0,
      "s3Key": "raw/a5d89f4b-22b0-4a81-9b1b-4f9e67a03281/0.jpg",
      "presignedPutUrl": "https://storage.example.com/raw/a5d89f4b...Signature=..."
    },
    {
      "sequenceOrder": 1,
      "s3Key": "raw/a5d89f4b-22b0-4a81-9b1b-4f9e67a03281/1.png",
      "presignedPutUrl": "https://storage.example.com/raw/a5d89f4b...Signature=..."
    }
  ]
}
```

---

### 2. Trigger Processing

* **Endpoint:** `POST /api/v1/conversions/{jobId}/start`
* **Response (202 Accepted):**
```json
{ "status": "QUEUED", "jobId": "a5d89f4b-22b0-4a81-9b1b-4f9e67a03281" }
```

---

### 3. Server-Sent Events (SSE) Stream

* **Endpoint:** `GET /api/v1/conversions/{jobId}/events`
* **Headers:** `Accept: text/event-stream`
* **Stream Sequence:**
```text
event: status
data: {"status":"PROCESSING","progress":10,"message":"Inspecting image headers"}

event: status
data: {"status":"PROCESSING","progress":70,"message":"Compiling vector canvas"}

event: complete
data: {"status":"COMPLETED","progress":100,"downloadUrl":"https://storage.example.com/converted/a5d89f4b...Signature=..."}
```

---

### 4. Redis Stream Task Schema (`conversions:jobs`)

* **Transport:** `XADD conversions:jobs * payload <json>`
```json
{
  "job_id": "a5d89f4b-22b0-4a81-9b1b-4f9e67a03281",
  "dpi": 150,
  "page_size": "A4",
  "orientation": "PORTRAIT",
  "target_s3_key": "converted/a5d89f4b-22b0-4a81-9b1b-4f9e67a03281/output.pdf",
  "files": [
    { "order": 0, "s3_key": "raw/a5d89f4b-22b0-4a81-9b1b-4f9e67a03281/0.jpg" },
    { "order": 1, "s3_key": "raw/a5d89f4b-22b0-4a81-9b1b-4f9e67a03281/1.png" }
  ]
}
```
