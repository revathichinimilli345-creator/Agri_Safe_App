import os
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create a superuser from ADMIN_USERNAME and ADMIN_PASSWORD env vars if one does not already exist"

    def handle(self, *args, **options):
        username = os.environ.get("ADMIN_USERNAME", "admin")
        password = os.environ.get("ADMIN_PASSWORD", "admin123")

        if not username or not password:
            self.stderr.write(
                self.style.ERROR(
                    "ADMIN_USERNAME and ADMIN_PASSWORD environment variables must be set."
                )
            )
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(
                    f"Superuser '{username}' already exists — skipping creation."
                )
            )
            return

        User.objects.create_superuser(
            username=username,
            password=password,
            email="",
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"Superuser '{username}' created successfully."
            )
        )
