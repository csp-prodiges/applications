from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import async_session, init_db
from app.routers import (
    actualites,
    admin,
    auth,
    cantine,
    classes,
    commandes,
    dashboard,
    devoirs,
    messagerie,
    notes,
    planning,
    public,
    ressources,
)
from app.seed import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    async with async_session() as session:
        await seed_database(session)
    yield


app = FastAPI(title="Cité Scolaire Prodiges — API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(public.router)
app.include_router(actualites.router)
app.include_router(notes.router)
app.include_router(devoirs.router)
app.include_router(planning.router)
app.include_router(cantine.router)
app.include_router(commandes.router)
app.include_router(messagerie.router)
app.include_router(ressources.router)
app.include_router(dashboard.router)
app.include_router(admin.router)
app.include_router(classes.router)


@app.get("/api/health")
async def health() -> dict:
    return {"status": "ok"}
