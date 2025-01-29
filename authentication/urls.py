from django.urls import path, re_path
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    path("", views.Login.as_view(), name="Login"),
    path("logout/", views.logout, name="logout"),
    path("auth/redirect", views.azure_ad_callback.as_view(), name="azure_ad_callback"),
    path("login_view/", views.Login_View.as_view(), name="login_view"),
    path('resend-otp/', views.resend_otp, name='resend_otp'),
    path('send-otps/', views.send_otps, name='send_otps'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path("planner-lines/<str:plan_id>/", views.GetPlannerLines.as_view(), name="get_planner_lines"),
    path("LeavePlanner/", views.LeavePlanner.as_view(), name="LeavePlanner"),
    path(
        "LeaveCancel/<str:pk>/", views.LeaveCancelApproval.as_view(), name="LeaveCancel"
    ),
    path(
        "FnCancelLeaveAdjustmentApproval/<str:pk>/",
        views.FnCancelLeaveAdjustmentApproval.as_view(),
        name="FnCancelLeaveAdjustmentApproval",
    ), 
    path("LeaveAdjustments/", views.LeaveAdjustments.as_view(), name="LeaveAdjustments"),
    path("dashboard_data/", views.DashboardData.as_view(), name="dashboard_data"),
    path(
        "FnLeavePlannerLine/<str:pk>/",
        views.FnLeavePlannerLine.as_view(),
        name="FnLeavePlannerLine",
    ),
    path(
        "FnReOpenLeavePlanner/<str:pk>/",
        views.FnReOpenLeavePlanner.as_view(),
        name="FnReOpenLeavePlanner",
    ),
    path(
        "FnAddLeavePlannerLine/<str:pk>/",
        views.FnAddLeavePlannerLine.as_view(),
        name="FnAddLeavePlannerLine",
    ),
    path(
        "FnSubmitLeavePlanner/<str:pk>/",
        views.FnSubmitLeavePlanner.as_view(),
        name="FnSubmitLeavePlanner",
    ),
    path("Leave/", views.NewLeave.as_view(), name="NewLeave"),
    path("HRLeaveReports/", views.HRLeaveReports.as_view(), name="HRLeaveReports"),
    path("LeaveBalance/", views.LeaveBalance.as_view(), name="LeaveBalance"),
    path(
        "FnLeaveReliever/<str:pk>/",
        views.FnLeaveReliever.as_view(),
        name="FnLeaveReliever",
    ),
    path(
        "FileUploadView/<str:pk>/",
        views.FileUploadView.as_view(),
        name="FileUploadView",
    ),
    path(
        "ApproveLeaveDetails/<str:pk>/",
        views.ApproveLeaveDetails.as_view(),
        name="ApproveLeaveDetails",
    ),
    path(
        "ApproveAdjustmentDetails/<str:pk>/",
        views.ApproveAdjustmentDetails.as_view(),
        name="ApproveAdjustmentDetails",
    ),
    path(
        "ApproveRecallDetails/<str:pk>/",
        views.ApproveRecallDetails.as_view(),
        name="ApproveRecallDetails",
    ),
    path(
        "FnRequestLeaveAdjustmentApproval/<str:pk>/",
        views.FnRequestLeaveAdjustmentApproval.as_view(),
        name="FnRequestLeaveAdjustmentApproval",
    ),
    path(
        "FnActionApprovals/<str:pk>/",
        views.FnActionApprovals.as_view(),
        name="FnActionApprovals",
    ),
    path("LeaveApprove/<str:pk>/", views.LeaveApproval.as_view(), name="LeaveApprove"),
    path("LeaveApprovers/<str:pk>/", views.LeaveApproversView.as_view(), name="LeaveApprovers"),
     path("AdjustmentApprovers/<str:pk>/", views.AdjustmentApproversView.as_view(), name="AdjustmentApprovers"),
    path('get-leave-types/', views.get_leave_types.as_view(), name='get_leave_types'),
    path('LeavePlanners/', views.LeavePlanners.as_view(), name='LeavePlanners'),
    path("NumberOfDaysFilter/",views.NumberOfDaysFilter.as_view(),name="NumberOfDaysFilter",
    ),
    path('get_leave_employees/', views.get_leave_employees.as_view(), name='get_leave_employees'),
    path("Approve/", views.Approval.as_view(), name="Approval"),
    path(
        "LeaveAdjustmentLine/<str:pk>/",
        views.LeaveAdjustmentLine.as_view(),
        name="LeaveAdjustmentLine",
    ),
    path("LeaveBalances/", views.LeaveBalances.as_view(), name="LeaveBalances"),
    path("DashboardReports/", views.DashboardReports.as_view(), name="DashboardReports"),
    path("LeaveDashboard/", views.LeaveDashboard.as_view(), name="LeaveDashboard"),
    path("all-leave-balance/", views.AllLeaveBalances.as_view(), name="AllLeaveBalances"),
    path(
        "FnGetAnnualLeaveDashboard/",
        views.FnGetAnnualLeaveDashboard.as_view(),
        name="FnGetAnnualLeaveDashboard",
    ),

    path("fetch-leave-days/", views.fetch_leave_days.as_view(), name="fetch_leave_days"),
        
    re_path(r"^(?!api/).*$", TemplateView.as_view(template_name="index.html")),
    re_path(r'^selfservice/.*$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^selfservice/dashboard/.*$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^selfservice/dashboard/my-plans/(?P<id>\d+)$', TemplateView.as_view(template_name='index.html')),  # Dynamic route for plan details
]
