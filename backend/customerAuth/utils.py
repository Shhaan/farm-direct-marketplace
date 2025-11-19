from django.core.mail import send_mail
import random
from django.conf import settings
from .models import Customers
def send_otp_via_mail(email):
    subject = 'Your acount verification '
    otp = random.randint(1000,9999)
    message = f"This is otp verification for FarmAid \n {otp} "
    from_email = settings.EMAIL_HOST
    send_mail(subject,message,from_email,[email])
    return otp
    