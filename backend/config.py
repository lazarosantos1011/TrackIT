import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://neondb_owner:npg_U3sW2ezSGAMx@ep-cold-meadow-ac6vtd7m-pooler.sa-east-1.aws.neon.tech/TrackIT_DB?sslmode=require')
    SQLALCHEMY_TRACK_MODIFICATIONS = False