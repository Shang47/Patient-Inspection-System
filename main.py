from typing import Union, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import UUID, uuid4

from models import Gender, Severity, Patient, PatientUpdateRequest

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERNAME = "admin"
PASS = "1234"

db: List[Patient] = [
    Patient(
        id=UUID("fc7b947b-7ca2-4dd7-ae57-6963454048a3"),
        name="Jamila",
        gender=Gender.female,
        severity=Severity.Emergent,
        number="P007",
        status="waiting",
    ),
    Patient(
        id=UUID("9b765c16-02fe-42db-b4c3-42a615e2fec6"),
        name="Alex",
        gender=Gender.male,
        severity=Severity.Resuscitation,
        number="P003",
        status="waiting",
    ),
]

current_inpect_patient_id = ""
'''
class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}
'''
class LoginInfo(BaseModel):
    username: str
    password: str

# Log in API
@app.post("/login")
def log_in(userInfo: LoginInfo):
    if userInfo.username == USERNAME and userInfo.password == PASS:
        return {"success": True}
    
    raise HTTPException(
        status_code=404,
        detail=f"account or password incorrect"
    )
    
# For displaying current patient under inspection
@app.get("/patients")
async def fetch_patients():
    return db;

@app.post("/patients")
async def register_patient(patient: Patient):
    db.append(patient)
    return {"id": patient.id}

@app.get("/inspection/current")
async def fetch_current_patient():
    if len(db) == 0:
        return None
    
    for p in db:
        if p.status == "inspecting":
            return p
    return None
        
@app.post("/inspection/start/{patient_id}")
async def inspect_patient(patient_id: UUID):
    global current_inpect_patient_id
    for p in db:
        if p.id == patient_id:
            current_inpect_patient_id= patient_id
            p.status = "inspecting" 

@app.post("/inspection/finish")
async def finish_inspection():
    global current_inpect_patient_id
    for p in db:
        if p.id == current_inpect_patient_id:
            p.status = "completed" 
            current_inpect_patient_id = ""

@app.delete("/api/v1/patients/{patient_id}")
async def delete_patient(patient_id: UUID):
    for patient in db:
        if patient.id == patient_id:
            db.remove(patient)
            return
        
    raise HTTPException(
        status_code=404,
        detail=f"patient with id: {patient_id} does not exist"
    )

@app.put("/api/v1/patients/{patient_id}")
async def update_patient(patient_id: UUID, patient_info: PatientUpdateRequest):

    nm = patient_info.name
    gdr = patient_info.gender
    svr = patient_info.severity
    sts = patient_info.status

    for patient in db:
        if patient.id == patient_id:
            if  nm is not None:
                patient.name = nm
            if gdr is not None:
                patient.gender = gdr
            if svr is not None:
                patient.severity = svr
            if sts is not None:
                patient.status = sts
            return
        
    raise HTTPException(
        status_code=404,
        detail=f"patient with id: {patient_id} does not exist"
    )


