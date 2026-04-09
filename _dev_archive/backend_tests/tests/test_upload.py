"""
Tests for the file upload endpoint.
"""
import io
import pytest


def _make_file(filename: str, content: bytes = b"fake-content", content_type: str = "image/jpeg"):
    return ("file", (filename, io.BytesIO(content), content_type))


class TestUpload:
    def test_upload_requires_auth(self, client):
        resp = client.post(
            "/api/storage/upload",
            files=[_make_file("test.jpg")],
        )
        assert resp.status_code == 401

    def test_upload_jpg_allowed(self, client, auth_headers):
        resp = client.post(
            "/api/storage/upload",
            headers=auth_headers,
            files=[_make_file("photo.jpg")],
        )
        assert resp.status_code == 200
        assert "publicUrl" in resp.json()

    def test_upload_png_allowed(self, client, auth_headers):
        resp = client.post(
            "/api/storage/upload",
            headers=auth_headers,
            files=[_make_file("image.png", content_type="image/png")],
        )
        assert resp.status_code == 200

    def test_upload_exe_blocked(self, client, auth_headers):
        resp = client.post(
            "/api/storage/upload",
            headers=auth_headers,
            files=[_make_file("malware.exe", content_type="application/octet-stream")],
        )
        assert resp.status_code == 400
        assert "not allowed" in resp.json()["detail"]

    def test_upload_php_blocked(self, client, auth_headers):
        resp = client.post(
            "/api/storage/upload",
            headers=auth_headers,
            files=[_make_file("shell.php", content_type="application/x-php")],
        )
        assert resp.status_code == 400

    def test_path_traversal_blocked(self, client, auth_headers):
        resp = client.post(
            "/api/storage/upload",
            headers=auth_headers,
            files=[_make_file("test.jpg")],
            data={"path": "../../etc/passwd"},
        )
        # Either blocked outright or safely resolved inside uploads/
        assert resp.status_code in (200, 400)
        if resp.status_code == 200:
            url = resp.json()["publicUrl"]
            assert ".." not in url
            assert "etc/passwd" not in url
