#backend/apps/config/settings/testing.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Determine environment
ENVIRONMENT = os.getenv('DJANGO_ENVIRONMENT', 'development')

if ENVIRONMENT == 'production':
    from .settings.production import *
elif ENVIRONMENT == 'testing':
    from .settings.testing import *
else:
    from .settings.development import *