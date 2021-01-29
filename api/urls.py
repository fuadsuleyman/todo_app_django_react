from django.urls import path
from .views import TaskViewSet

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'task', TaskViewSet, basename='task')
urlpatterns = router.urls




# urlpatterns = [
#     path('', views.apiOverview, name="api-overview"),
#     path('task-list/', views.taskList, name="task-list"),
#     path('task-detail/<str:pk>/', views.taskDetail, name="task-detail"),
#     path('task-create/', views.taskCreate, name="task-create"),
#     path('task-update/<str:pk>/', views.taskUpdate, name="task-update"),
#     path('task-delete/<str:pk>/', views.taskDelete, name="task-delete"),
# ]