# Generated by Django 4.0 on 2024-04-22 20:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0006_rename_image_club_banner'),
    ]

    operations = [
        migrations.AddField(
            model_name='club',
            name='color',
            field=models.CharField(default='#FFFFF', max_length=800),
            preserve_default=False,
        ),
    ]
