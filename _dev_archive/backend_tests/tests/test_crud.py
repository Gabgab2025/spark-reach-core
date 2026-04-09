"""
Tests for CRUD operations via the API.
"""
import pytest


class TestPages:
    def test_list_pages_public(self, client):
        resp = client.get("/api/pages")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_create_page_requires_admin(self, client):
        resp = client.post("/api/pages", json={
            "title": "Test Page",
            "slug": "test-page",
            "status": "draft",
        })
        assert resp.status_code == 401

    def test_create_read_update_delete_page(self, client, auth_headers):
        # CREATE
        resp = client.post("/api/pages", headers=auth_headers, json={
            "title": "My Test Page",
            "slug": "my-test-page",
            "status": "draft",
            "page_type": "custom",
        })
        assert resp.status_code == 200
        page_id = resp.json()["id"]

        # READ
        resp = client.get("/api/pages")
        slugs = [p["slug"] for p in resp.json()]
        assert "my-test-page" in slugs

        # UPDATE
        resp = client.put(f"/api/pages/{page_id}", headers=auth_headers, json={
            "status": "published",
        })
        assert resp.status_code == 200
        assert resp.json()["status"] == "published"

        # DELETE
        resp = client.delete(f"/api/pages/{page_id}", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["ok"] is True

    def test_invalid_status_rejected(self, client, auth_headers):
        resp = client.put("/api/pages/nonexistent", headers=auth_headers, json={
            "status": "invalid_status",
        })
        assert resp.status_code == 422


class TestBlogPosts:
    def test_list_blog_posts_public(self, client):
        resp = client.get("/api/blog_posts")
        assert resp.status_code == 200

    def test_create_blog_post(self, client, auth_headers):
        resp = client.post("/api/blog_posts", headers=auth_headers, json={
            "title": "Test Blog Post",
            "slug": "test-blog-post",
            "status": "draft",
            "content": "<p>Hello World</p>",
        })
        assert resp.status_code == 200
        assert resp.json()["slug"] == "test-blog-post"


class TestHtmlSanitization:
    def test_script_tags_stripped(self, client, auth_headers):
        resp = client.post("/api/blog_posts", headers=auth_headers, json={
            "title": "XSS Test",
            "slug": "xss-test-post",
            "status": "draft",
            "content": "<p>Hello</p><script>alert('xss')</script>",
        })
        assert resp.status_code == 200
        content = resp.json()["content"]
        assert "<script>" not in content
        assert "alert" not in content

    def test_safe_html_preserved(self, client, auth_headers):
        resp = client.post("/api/blog_posts", headers=auth_headers, json={
            "title": "Safe HTML Test",
            "slug": "safe-html-test",
            "status": "draft",
            "content": "<p><strong>Bold</strong> and <em>italic</em></p>",
        })
        assert resp.status_code == 200
        content = resp.json()["content"]
        assert "<strong>Bold</strong>" in content
        assert "<em>italic</em>" in content


class TestSettings:
    def test_public_settings_excludes_sensitive(self, client, auth_headers):
        # First set a sensitive setting
        client.post("/api/settings/bulk_update", headers=auth_headers, json={
            "settings": [
                {"key": "smtp_password", "value": "super-secret"},
                {"key": "site_name", "value": "JDGK"},
            ]
        })
        # Public endpoint must not return smtp_password
        resp = client.get("/api/settings/public")
        assert resp.status_code == 200
        keys = [s["key"] for s in resp.json()]
        assert "smtp_password" not in keys
        assert "site_name" in keys

    def test_admin_settings_returns_all(self, client, auth_headers):
        resp = client.get("/api/settings", headers=auth_headers)
        assert resp.status_code == 200


class TestTeamMembers:
    def test_list_team_members_public(self, client):
        resp = client.get("/api/team_members")
        assert resp.status_code == 200

    def test_create_team_member(self, client, auth_headers):
        resp = client.post("/api/team_members", headers=auth_headers, json={
            "name": "Jane Doe",
            "role": "cto",
            "is_leadership": True,
        })
        assert resp.status_code == 200
        assert resp.json()["name"] == "Jane Doe"
