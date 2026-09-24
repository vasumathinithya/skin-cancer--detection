# A06 — Prediction Endpoint Latency Evidence

## Test protocol

- Endpoint: POST /api/predict
- Server: Flask development server
- Host: 127.0.0.1:5000
- Test image: ISIC_0024306.jpg from HAM10000
- Repetitions: 10 consecutive requests
- Measurement boundary: HTTP request from client to local Flask endpoint and returned response
- Included: image upload/request handling, image validation/preprocessing, model inference, and response generation
- Excluded: external network/internet latency and production infrastructure latency
- HTTP result: 10/10 requests returned HTTP 200
- CPU: 12th Gen Intel(R) Core(TM) i5-12450H
- Python: 3.10.11
- TensorFlow: 2.15.0

## Raw timings

| Run | HTTP | Total seconds |
|---:|---:|---:|
| 1 | 200 | 0.099381 |
| 2 | 200 | 0.131020 |
| 3 | 200 | 0.171696 |
| 4 | 200 | 0.168572 |
| 5 | 200 | 0.151548 |
| 6 | 200 | 0.181090 |
| 7 | 200 | 0.171991 |
| 8 | 200 | 0.197926 |
| 9 | 200 | 0.251981 |
| 10 | 200 | 0.318359 |

## Summary

- Mean: approximately 0.184 seconds
- Median (P50): approximately 0.172 seconds
- P95: approximately 0.291 seconds
- Minimum: 0.099 seconds
- Maximum: 0.318 seconds

## Interpretation

These measurements describe the local development endpoint under the stated test conditions. They are not production or internet end-to-end latency measurements.

The historical 7-second prediction-time statement is not treated as independently verified by this test because its original measurement protocol, repetitions, environment, and raw timings were not preserved.

The measured endpoint result should therefore be reported with its test boundary and environment rather than presented as a general production performance claim.
