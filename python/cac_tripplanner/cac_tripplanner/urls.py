from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'cac_tripplanner.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', 'cac_tripplanner.views.base', name='base'),
    url(r'^admin/', include(admin.site.urls)),
)
