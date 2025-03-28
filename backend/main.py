from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncpg
import os

app = FastAPI()

DATABASE_URL = os.getenv("DATABASE_URL")
REPLICA_URL = os.getenv("REPLICA_URL")

async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)

async def get_replica_connection():
    return await asyncpg.connect(REPLICA_URL)

class Transaction(BaseModel):
    sender: str
    receiver: str
    amount: float

@app.post("/transactions/")
async def create_transaction(transaction: Transaction):
    conn = await get_db_connection()
    try:
        await conn.execute(
            "INSERT INTO transactions (sender, receiver, amount) VALUES ($1, $2, $3)",
            transaction.sender, transaction.receiver, transaction.amount
        )
        return {"message": "Transaction successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

@app.get("/transactions/")
async def get_transactions():
    conn = await get_replica_connection()
    try:
        rows = await conn.fetch("SELECT * FROM transactions ORDER BY id DESC LIMIT 10")
        return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()
