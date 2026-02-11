
from pathlib import Path
import os
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-^#kvc+2ldbfa6c+u=h)$g)gmygxi5b52rfpy%)96_99usr!yg8'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS =['*']


# Application definition

INSTALLED_APPS = [
    "daphne",
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
     
     'corsheaders',
     'rest_framework',
     'rest_framework_simplejwt.token_blacklist',
    'customerProfile',
    'adminAuth',
    'customerAuth',
    'farmerAuth',
    'googleAuth',
    'AdminMain',
    'farmerMain',
    'chat'
    
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'farmdb',
        'USER': 'postgres',
        'PASSWORD': 'sql#786',
        'HOST': 'localhost',    
        'PORT': '5432',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


SESSION_ENGINE = 'django.contrib.sessions.backends.db'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field


REST_FRAMEWORK = {
    
    'DEFAULT_AUTHENTICATION_CLASSES': (
        
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
   }


SIMPLE_JWT = {
     'ACCESS_TOKEN_LIFETIME': timedelta(minutes=9),
     'REFRESH_TOKEN_LIFETIME': timedelta(days=50),
         "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
      
}
CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOW_HEADERS = ['*']
CORS_ALLOW_METHODS = ['*']

CSRF_TRUSTED_ORIGINS = [
    "http://*",
    "https://*",
]


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STRIP_KEY = 'sk_test_51PHrgtSE9Hs6vPUhuB9gZrHF55o0kFWZ7X8EV2GbT5JFjfoNxLTQXgGTWEuQaBMQ78d069kaxlc5OZ3YjmnLH7mw00qW6kAiYr'


# ASgi for chat

ASGI_APPLICATION = "backend.asgi.application"



CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}





MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = "/media/"
AUTH_USER_MODEL = "customerAuth.Customers"

 
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "shanmohamme.123@gmail.com"
EMAIL_HOST_PASSWORD = "nfsq ywqv lwva zlod"


# google auth
 
BASE_APP_URL = "http://localhost:3000"
BASE_API_URL = "http://127.0.0.1:8000/"
BASE_APP_URL_FARMER = "http://localhost:3000/farmer/"
BASE_APP_URL_CUSTOMER_REGISTER = "http://localhost:3000/register/"

GOOGLE_OAUTH2_CLIENT_ID = '64469589733-m3hqdmjm2rf9ucihqqpgbhjjn86t0k8e.apps.googleusercontent.com'
GOOGLE_OAUTH2_CLIENT_SECRET = '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'


PAYPAL_CLIENT_ID = "AbGbVfxKIHTIJ6XKYTn6l2fIgafj6GjtYYMEPAMA777t12Q96LWl7sZ0z0xajdQ8p4_Buc8SXEer3tl2"
PAYPAL_SECRET_ID="AbGbVfxKIHTIJ6XKYTn6l2fIgafj6GjtYYMEPAMA777t12Q96LWl7sZ0z0xajdQ8p4_Buc8SXEer3tl2"
PAYPAL_WEBHOOK_ID='WH-2N1678257S892762B-8MC99539P4557624Y'