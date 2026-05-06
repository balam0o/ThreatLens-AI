from app.services.log_analyzer import analyze_log_text


def test_detects_failed_password_as_high_severity():
    log_text = (
        "Jan 10 12:01:02 server sshd[1234]: "
        "Failed password for root from 185.23.44.10 port 52231 ssh2"
    )

    result = analyze_log_text(log_text)

    assert result.severity == "high"
    assert "failed password" in result.detected_patterns
    assert len(result.evidence) >= 1
    assert len(result.recommended_actions) >= 1


def test_benign_log_returns_low_severity():
    log_text = "Jan 10 12:01:02 server systemd[1]: Started daily cleanup task."

    result = analyze_log_text(log_text)

    assert result.severity == "low"
    assert result.detected_patterns == []
    assert result.evidence == []
    assert len(result.recommended_actions) >= 1


def test_detects_critical_malware_indicator():
    log_text = "Alert: malware activity detected on host web-server-01."

    result = analyze_log_text(log_text)

    assert result.severity == "critical"
    assert "malware" in result.detected_patterns
    assert len(result.evidence) >= 1