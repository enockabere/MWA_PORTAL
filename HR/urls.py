from django.urls import path
from . import views

urlpatterns = [
    
    path("Applications", views.Applications.as_view(), name="Applications"),
    path("Leave/<str:pk>/", views.LeaveDetails.as_view(), name="LeaveDetails"),
        
    path(
        "FnArchiveLeaveApplication/<str:pk>/",
        views.FnArchiveLeaveApplication.as_view(),
        name="FnArchiveLeaveApplication",
    ),
    path(
        "DeleteLeaveAttachment/<str:pk>",
        views.DeleteLeaveAttachment.as_view(),
        name="DeleteLeaveAttachment",
    ),
    path(
        "FnGenerateLeave/<str:pk>",
        views.FnGenerateLeaveReport.as_view(),
        name="FnGenerateLeaveReport",
    ),
    path("LeaveReports", views.LeaveReports.as_view(), name="LeaveReports"),
    path("MyAdjustments", views.MyAdjustments.as_view(), name="MyAdjustments"),
    path(
        "Adjustment/<str:pk>/",
        views.AdjustmentDetails.as_view(),
        name="AdjustmentDetails",
    ),   
        
    path("Plans", views.MyPlans.as_view(), name="MyPlans"),
    path(
        "Plan/<str:pk>/",
        views.PlannerDetails.as_view(),
        name="PlannerDetails",
    ),
    
    
]
