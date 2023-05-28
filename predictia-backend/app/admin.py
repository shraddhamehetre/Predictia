from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Dyslexia, Dysgraphia, Dyscalculia


class DyslexiaAdmin(admin.ModelAdmin):
    list_display = ('user', 'score', 'checked_date', 'details', "image")

class DysgraphiaAdmin(admin.ModelAdmin):
    list_display = ('user', 'test_result', 'checked_date')

class DyscalculiaAdmin(admin.ModelAdmin):
    list_display = ('user', 'test_result', 'checked_date')


admin.site.register(Dyslexia, DyslexiaAdmin)
admin.site.register(Dysgraphia, DysgraphiaAdmin)
admin.site.register(Dyscalculia, DyscalculiaAdmin)
