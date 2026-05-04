from app.schemas.analysis import LogAnalysisResponse


SUSPICIOUS_PATTERNS = {
    "critical": [
        "ransomware",
        "malware",
        "privilege escalation",
        "root compromise",
        "data exfiltration",
    ],
    "high": [
        "failed password",
        "invalid user",
        "authentication failure",
        "brute force",
        "port scan",
        "nmap",
        "sql injection",
        "unauthorized access",
    ],
    "medium": [
        "permission denied",
        "connection refused",
        "suspicious",
        "blocked",
        "firewall drop",
        "multiple attempts",
    ],
    "low": [
        "warning",
        "timeout",
        "retry",
        "not found",
    ],
}


RECOMMENDATIONS = {
    "critical": [
        "Isolate the affected system immediately.",
        "Rotate potentially compromised credentials.",
        "Review recent administrative activity.",
        "Collect forensic evidence before making major changes.",
    ],
    "high": [
        "Block or rate-limit the suspicious source IP address.",
        "Review authentication logs for repeated failures.",
        "Disable root login over SSH if enabled.",
        "Enable multi-factor authentication where possible.",
    ],
    "medium": [
        "Monitor the source and destination involved.",
        "Check whether the activity repeats over time.",
        "Review firewall and access control rules.",
    ],
    "low": [
        "Keep monitoring the event.",
        "Verify whether this behavior is expected.",
    ],
}


def analyze_log_text(log_text: str) -> LogAnalysisResponse:
    normalized_log = log_text.lower()
    detected_patterns: list[str] = []
    evidence: list[str] = []

    severity_order = ["critical", "high", "medium", "low"]
    selected_severity = "low"

    for severity in severity_order:
        for pattern in SUSPICIOUS_PATTERNS[severity]:
            if pattern in normalized_log:
                detected_patterns.append(pattern)
                selected_severity = severity

                matching_lines = [
                    line.strip()
                    for line in log_text.splitlines()
                    if pattern in line.lower()
                ]

                evidence.extend(matching_lines[:3])

        if detected_patterns:
            break

    if not detected_patterns:
        return LogAnalysisResponse(
            severity="low",
            summary="No clearly suspicious patterns were detected in the provided logs.",
            detected_patterns=[],
            evidence=[],
            recommended_actions=[
                "Continue monitoring.",
                "Provide more logs if suspicious behavior is still suspected.",
            ],
        )

    summary = build_summary(selected_severity, detected_patterns)

    return LogAnalysisResponse(
        severity=selected_severity,
        summary=summary,
        detected_patterns=detected_patterns,
        evidence=evidence,
        recommended_actions=RECOMMENDATIONS[selected_severity],
    )


def build_summary(severity: str, detected_patterns: list[str]) -> str:
    patterns = ", ".join(sorted(set(detected_patterns)))

    return (
        f"The log analysis detected {severity.upper()} severity indicators. "
        f"Observed suspicious patterns include: {patterns}."
    )