# Generated by Django 4.0 on 2024-04-24 20:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0010_user_image_alter_member_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='member',
            name='role',
            field=models.CharField(choices=[('president', 'President'), ('vice president', 'Vice President'), ('secretary', 'Secretary'), ('treasurer', 'Treasurer'), ('member', 'Member')], default='member', max_length=250),
        ),
    ]
