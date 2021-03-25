from typing import Optional
from boto3.session import Session
import boto3

from fastapi import FastAPI
from pydantic import BaseModel

ACCESS_KEY = ''
SECRET_KEY = ''
BUCKET_NAME = ''

fileName = "test43.pdf"
leList = []


session = Session(aws_access_key_id=ACCESS_KEY,
              aws_secret_access_key=SECRET_KEY)
s3 = session.resource('s3')
your_bucket = s3.Bucket(BUCKET_NAME)

app = FastAPI()

class pdf(BaseModel):
    name: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/items/{item_uuid}")
def update_item(item_uuid: str, item: pdf):
    your_bucket.download_file(f"{item_uuid}.pdf", f"./{item.name}.pdf")
    print("Is Working")
    return {"status":f"received {item_uuid}"}
 