"""
Tests for authentication endpoints.
"""
import pytest


class TestLogin:
    def test_valid_credentials(self, client):
        resp = client.post("/api/auth/login", json={
            "email": "admin@jdgkbsi.ph",
            "password": "JdgkAdmin2026!",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "session" in data
        assert data["session"]["access_token"]
        assert data["session"]["user"]["email"] == "admin@jdgkbsi.ph"

    def test_invalid_password(self, client):
        resp = client.post("/api/auth/login", json={
            "email": "admin@jdgkbsi.ph",
            "password": "wrongpassword",
        })
        assert resp.status_code == 401

    def test_invalid_email(self, client):
        resp = client.post("/api/auth/login", json={
            "email": "nobody@example.com",
            "password": "anypassword",
        })
        assert resp.status_code == 401

    def test_malformed_email_rejected(self, client):
        resp = client.post("/api/auth/login", json={
            "email": "not-an-email",
            "password": "somepassword",
        })
        assert resp.status_code == 422  # Pydantic validation error

    def test_missing_fields(self, client):
        resp = client.post("/api/auth/login", json={})
        assert resp.status_code == 422


class TestSession:
    def test_session_returns_user(self, client, auth_headers):
        resp = client.get("/api/auth/session", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["session"]["user"]["email"] == "admin@jdgkbsi.ph"

    def test_session_without_token_returns_null(self, client):
        resp = client.get("/api/auth/session")
        assert resp.status_code == 200
        assert resp.json()["session"] is None


class TestSignup:
    def test_signup_creates_user_role(self, client):
        resp = client.post("/api/auth/signup", json={
            "email": "testuser@example.com",
            "password": "securepass123",
            "full_name": "Test User",
        })
        assert resp.status_code == 200
        user = resp.json()["session"]["user"]
        assert user["role"] == "user"  # Never admin

    def test_signup_duplicate_email(self, client):
        client.post("/api/auth/signup", json={
            "email": "duplicate@example.com",
            "password": "securepass123",
        })
        resp = client.post("/api/auth/signup", json={
            "email": "duplicate@example.com",
            "password": "anotherpass456",
        })
        assert resp.status_code == 400

    def test_signup_weak_password_rejected(self, client):
        resp = client.post("/api/auth/signup", json={
            "email": "weakpass@example.com",
            "password": "short",
        })
        assert resp.status_code == 422

    def test_signup_invalid_email_rejected(self, client):
        resp = client.post("/api/auth/signup", json={
            "email": "bad-email",
            "password": "securepass123",
        })
        assert resp.status_code == 422


class TestLogout:
    def test_logout_returns_ok(self, client):
        resp = client.post("/api/auth/logout")
        assert resp.status_code == 200
        assert "Logged out" in resp.json()["message"]
