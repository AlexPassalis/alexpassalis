from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Email

@csrf_exempt  # Use with caution; consider using CSRF protection in production
def save_email(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            if email:
                Email.objects.create(email=email)
                return JsonResponse({'response': 'Email saved successfully!'}, status=201)
            return JsonResponse({'error': 'Email is required.'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)