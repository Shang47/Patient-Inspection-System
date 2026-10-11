from typing import Optional, List
from uuid import UUID, uuid4
from pydantic import BaseModel, Field
from enum import Enum

class Gender(str, Enum):
    male = "male"
    female = "female"

# TTAS
class Severity(int, Enum):
    Resuscitation = 1
    Emergent = 2
    Urgent = 3
    Semi_urgent = 4
    Non_urgent = 5

class Status(str, Enum):
    Waiting = "waiting"
    Inspecting = "inspecting"
    Completed = "completed"

class Patient(BaseModel):
    id: Optional[UUID] = Field(default_factory=uuid4)
    name: str
    gender: Gender
    severity: Severity
    number: str
    status: Optional[str] = "waiting"

class PatientUpdateRequest(BaseModel):
    name: Optional[str] = None
    gender: Optional[Gender] = None
    severity: Optional[Severity] = None
    number: Optional[str] = None
    status: Optional[str] = None

"""
class Role(str, Enum):
    admin = "admin"
    manager = "manager"
    user = "user"


class User(BaseModel):
    id: Optional[UUID] = uuid4()
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    gender: Gender
    roles: List[Role]

class UserUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    roles: Optional[List[Role]] = None
"""