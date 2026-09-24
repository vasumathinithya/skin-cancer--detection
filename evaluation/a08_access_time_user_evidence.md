# A08 — Access-Time and User Evidence

## Scope

This evidence file separates the historical care-access baseline from software response-time measurements.

The historical project materials refer to a 30–40-day care-access baseline, a best software value below five seconds, and a ten-user evaluation. The recovered repository does not contain sufficient source records to independently verify the care-access baseline or the ten-user evaluation.

## Historical 30–40-day care-access baseline

The historical 30–40-day care-access value is not independently verified in the recovered repository.

The following evidence was not recovered:

- source document or dataset supporting the 30–40-day baseline
- defined population or cohort
- measurement period
- definition of the access-time endpoint
- raw observations
- calculation supporting the reported value

Therefore, the 30–40-day value is treated as an unverified historical claim.

## Historical ten-user evaluation

The recovered repository does not contain the records required to independently verify the historical ten-user evaluation.

The following evidence was not recovered:

- de-identified participant records
- eligibility criteria
- task protocol
- participant/task mapping
- raw timestamps
- survey or interview exports
- consent or ethics documentation

Therefore, the historical ten-user result is treated as unverified.

## Software response-time evidence

The recovered repository contains a separate local endpoint latency measurement documented in evaluation/a06_latency_evidence.md.

Test conditions:

- Endpoint: POST /api/predict
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

Measured timings:

- Mean: approximately 0.184 seconds
- Median (P50): approximately 0.172 seconds
- P95: approximately 0.291 seconds
- Minimum: 0.099 seconds
- Maximum: 0.318 seconds

These measurements describe the local development endpoint under the stated test conditions. They are not production or internet end-to-end latency measurements.

## Evidence status

The software response-time measurement is supported by raw per-run timings.

The historical 30–40-day care-access baseline and ten-user evaluation are not independently verified because their required source records and raw evidence were not recovered.

The two constructs must not be combined or presented as evidence that the software reduced dermatologist waiting time, reduced clinical access time, or achieved diagnostic equivalence.

Any future evaluation should preserve the source of the care-access baseline, cohort definition, task protocol, anonymized participant/task records, versioned environment, and raw per-run timings so that each reported value can be independently reproduced.
