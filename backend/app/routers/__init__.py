from .auth import router as auth_router
from .users import router as users_router
from .pages import router as pages_router
from .services import router as services_router
from .blog import router as blog_router
from .jobs import router as jobs_router
from .testimonials import router as testimonials_router
from .team import router as team_router
from .gallery import router as gallery_router
from .settings import router as settings_router
from .content_blocks import router as content_blocks_router
from .analytics import router as analytics_router
from .storage import router as storage_router
from .contact import router as contact_router

all_routers = [
    auth_router,
    users_router,
    pages_router,
    services_router,
    blog_router,
    jobs_router,
    testimonials_router,
    team_router,
    gallery_router,
    settings_router,
    content_blocks_router,
    analytics_router,
    storage_router,
    contact_router,
]
