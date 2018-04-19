# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-04-13 15:42
from __future__ import unicode_literals

import destinations.models
from django.db import migrations
import image_cropping.fields


class Migration(migrations.Migration):

    dependencies = [
        ('destinations', '0039_auto_20180413_1113'),
    ]

    operations = [
        migrations.AlterField(
            model_name='destination',
            name='image_raw',
            field=image_cropping.fields.ImageCropField(upload_to=destinations.models.generate_filename, verbose_name=b'image file'),
        ),
        migrations.AlterField(
            model_name='destination',
            name='wide_image_raw',
            field=image_cropping.fields.ImageCropField(upload_to=destinations.models.generate_filename, verbose_name=b'wide image file'),
        ),
        migrations.AlterField(
            model_name='event',
            name='image_raw',
            field=image_cropping.fields.ImageCropField(upload_to=destinations.models.generate_filename, verbose_name=b'image file'),
        ),
        migrations.AlterField(
            model_name='event',
            name='wide_image_raw',
            field=image_cropping.fields.ImageCropField(upload_to=destinations.models.generate_filename, verbose_name=b'wide image file'),
        ),
    ]
