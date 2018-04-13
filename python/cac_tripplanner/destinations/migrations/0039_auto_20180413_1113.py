# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-04-13 15:13
from __future__ import unicode_literals

from django.db import migrations
import image_cropping.fields


class Migration(migrations.Migration):

    dependencies = [
        ('destinations', '0038_auto_20180412_1639'),
    ]

    operations = [
        migrations.AddField(
            model_name='extradestinationpicture',
            name='wide_image',
            field=image_cropping.fields.ImageRatioField(b'image_raw', '680x400', adapt_rotation=False, allow_fullsize=False, free_crop=False, help_text=b'Image will be displayed at 680x400', hide_image_field=False, size_warning=True, verbose_name='wide image'),
        ),
        migrations.AddField(
            model_name='extraeventpicture',
            name='wide_image',
            field=image_cropping.fields.ImageRatioField(b'image_raw', '680x400', adapt_rotation=False, allow_fullsize=False, free_crop=False, help_text=b'Image will be displayed at 680x400', hide_image_field=False, size_warning=True, verbose_name='wide image'),
        ),
        migrations.AlterField(
            model_name='extradestinationpicture',
            name='image',
            field=image_cropping.fields.ImageRatioField(b'image_raw', '310x155', adapt_rotation=False, allow_fullsize=False, free_crop=False, help_text=b'Image will be displayed at 310x155', hide_image_field=False, size_warning=True, verbose_name='image'),
        ),
        migrations.AlterField(
            model_name='extraeventpicture',
            name='image',
            field=image_cropping.fields.ImageRatioField(b'image_raw', '310x155', adapt_rotation=False, allow_fullsize=False, free_crop=False, help_text=b'Image will be displayed at 310x155', hide_image_field=False, size_warning=True, verbose_name='image'),
        ),
    ]
