import asyncio
import json
import logging
import random
import string
import aiohttp
from django.shortcuts import render, redirect
from myRequest.views import UserObjectMixins
from django.contrib import messages
from django.views import View
from django.conf import settings as config
from asgiref.sync import sync_to_async
import requests
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from datetime import datetime as dates
import io as BytesIO
import base64
from django.http import HttpResponse
import datetime


class Login_View(UserObjectMixins,View):
    async def post(self, request):
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            if not email:
                error_message = "Email cannot be empty"
                return JsonResponse({'error': error_message}, status=400)
            else:
                error_message = "Password cannot be empty"
                return JsonResponse({'error': error_message}, status=400)
            
        soap_headers = {
                        "username": config.WEB_SERVICE_UID,
                        "password": config.WEB_SERVICE_PWD,
                        }
        await sync_to_async(request.session.__setitem__)(
                            "soap_headers", soap_headers
                        )
        url = f"/QyUserSetup?$filter=EMail%20eq%20%27{email}%27"
        async with aiohttp.ClientSession() as session:
                task_get_user_setup = asyncio.ensure_future(
                    self.fetch_data(
                        session, soap_headers['username'], soap_headers['password'],url
                    )
                )
                user_response = await asyncio.gather(task_get_user_setup)
                if user_response[0]["status_code"] == 200:
                    for data in user_response[0]["data"]:
                        missing_keys = [
                            key
                            for key in [
                                "UserID",
                                "HODUser",
                            ]
                            if key not in data
                            or (data.get(key) is None or data.get(key) == "")
                        ]
                        if missing_keys:
                            error_message = (
                                f"Missing data for: {', '.join(missing_keys)}"
                            )
                            raise ValueError(error_message)

                        if data["CustomerNo"] == None or data["CustomerNo"] == "":
                            await sync_to_async(request.session.__setitem__)(
                                "Customer_No_", "None"
                            )
                        else:
                            await sync_to_async(request.session.__setitem__)(
                                "Customer_No_", data["CustomerNo"]
                            )
                        await sync_to_async(request.session.__setitem__)(
                            "User_ID", data["UserID"]
                        )

                        await sync_to_async(request.session.__setitem__)(
                                "E_Mail", data["EMail"]
                            )
                        if data["PhoneNo"] == None or data["PhoneNo"] == "":
                            await sync_to_async(request.session.__setitem__)(
                                "PhoneNo", "None"
                            )
                        else:
                            await sync_to_async(request.session.__setitem__)(
                                "PhoneNo", data["PhoneNo"]
                            )
                        await sync_to_async(request.session.__setitem__)(
                            "HOD_User", data["HODUser"]
                        )
                        await sync_to_async(request.session.__setitem__)(
                                "Employee_No_", data["EmployeeNo"]
                            )
                        await sync_to_async(request.session.save)()
                        Employee_No_ = await sync_to_async(request.session.__getitem__)(
                            "Employee_No_"
                        )

                        User_ID = await sync_to_async(request.session.__getitem__)(
                            "User_ID"
                        )

                        get_task_employee = asyncio.ensure_future(
                            self.fetch_one_filtered_data(
                                session, "/QyEmployees", "No_", "eq", Employee_No_
                            )
                        )
                        task_get_leave = asyncio.ensure_future(
                            self.simple_one_filtered_data(
                                session,
                                "/QyLeaveApplications",
                                "User_ID",
                                "eq",
                                User_ID,
                            )
                        )

                        employee_response = await asyncio.gather(
                            get_task_employee, task_get_leave
                        )

                        open_leave_count = len(
                            [x for x in employee_response[1] if x["Status"] == "Open"]
                        )

                        await sync_to_async(request.session.__setitem__)(
                            "open_leave_count", open_leave_count
                        )

                        for data in employee_response[0]["data"]:
                            missing_keys = [
                                key
                                for key in [
                                    "First_Name",
                                ]
                                if key not in data
                                or (data.get(key) is None or data.get(key) == "")
                            ]
                            if missing_keys:
                                error_message = (
                                    f"Missing data for: {', '.join(missing_keys)}"
                                )
                                raise ValueError(error_message)
                            await sync_to_async(request.session.__setitem__)(
                                "First_Name", data.get("First_Name", "None")
                            )

                            # Set Middle_Name
                            middle_name = data.get("Middle_Name", "")
                            if middle_name == "":
                                middle_name = "None"
                            await sync_to_async(request.session.__setitem__)(
                                "Middle_Name", middle_name
                            )

                            last_name = data.get("Last_Name", "")
                            if last_name == "":
                                last_name = "None"
                            await sync_to_async(request.session.__setitem__)(
                                "Last_Name", last_name
                            )

                            full_name = data["First_Name"]
                            if middle_name != "None":
                                full_name += " " + middle_name
                            if last_name != "None":
                                full_name += " " + last_name
                            await sync_to_async(request.session.__setitem__)(
                                "full_name", full_name
                            )

                            if (
                                data["Global_Dimension_1_Code"] == None
                                or data["Global_Dimension_1_Code"] == ""
                            ):
                                await sync_to_async(request.session.__setitem__)(
                                    "sectionCode", "None"
                                )
                            else:
                                await sync_to_async(request.session.__setitem__)(
                                    "sectionCode", data["Global_Dimension_1_Code"]
                                )

                            if (
                                data["Global_Dimension_2_Code"] == None
                                or data["Global_Dimension_2_Code"] == ""
                            ):
                                await sync_to_async(request.session.__setitem__)(
                                    "Department", "None"
                                )
                            else:
                                await sync_to_async(request.session.__setitem__)(
                                    "Department", data["Global_Dimension_2_Code"]
                                )

                            if (
                                data["Supervisor_Title"] == None
                                or data["Supervisor_Title"] == ""
                            ):
                                await sync_to_async(request.session.__setitem__)(
                                    "Supervisor_Title", "None"
                                )
                            else:
                                await sync_to_async(request.session.__setitem__)(
                                    "Supervisor_Title", data["Supervisor_Title"]
                                )

                            if data["Supervisor"] == None or data["Supervisor"] == "":
                                await sync_to_async(request.session.__setitem__)(
                                    "Supervisor", "None"
                                )
                            else:
                                await sync_to_async(request.session.__setitem__)(
                                    "Supervisor", data["Supervisor"]
                                )

                            if (
                                data["Job_Position"] == None
                                or data["Job_Position"] == ""
                            ):
                                request.session["Job_Position"] = "Job Position"
                            else:
                                request.session["Job_Position"] = data["Job_Position"]

                            if data["Job_Title"] == None or data["Job_Title"] == "":
                                request.session["Job_Title"] = "Job Title"
                            else:
                                request.session["Job_Title"] = data["Job_Title"]
                            default_password = 'Z0FBQUFBQm5Fa1RnYzhPbS1fM1hIVzNlUzVrcVBaRUFsVC1LS2lzLVNUUFV3MmdBalFweHJqMmp3X2pZdnlETm14ZUp2UGlZdFJvdUNHMUkwMHpJNnZMTzN3ck9WclcyYUE9PQ=='
                            decrypted = self.pass_decrypt(default_password)
                            if decrypted == password:
                                return JsonResponse({'redirect_url': '/selfservice/forgot-password/'})
                            else:
                                return JsonResponse({'redirect_url': '/selfservice/dashboard/'})
                        return JsonResponse({'error': "Employee number not recognized"}, status=400)
                    return JsonResponse({'error': "User ID not recognized"}, status=400)
                return JsonResponse({'error': "Authentication Error: Invalid credentials"}, status=400)


        

def send_otps(request):
    if request.method == 'GET':
        # Extract the email from the query parameters (GET request)
        email = request.GET.get('email')  # Get email from the URL query parameter
        
        if email:
            return JsonResponse({'status': 'OTP sent'})
        else:
            return JsonResponse({'error': 'Email not provided'}, status=400)
    
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def resend_otp(request):
    if request.method == 'POST':
        # Simulate OTP being resent
        return JsonResponse({'status': 'success', 'message': 'OTP resent successfully!'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


class GetPlannerLines(UserObjectMixins,View):
    async def get(self,request, plan_id):
        try:
            lines =[]
            async with aiohttp.ClientSession() as session:
                task_get_plan_lines = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyLeavePlanLines", "DocumentNo", "eq", plan_id
                    )
                )
                response = await asyncio.gather(task_get_plan_lines)
                lines = [x for x in response[0]]
            return JsonResponse(lines, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, safe=False)

def verify_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            otp = data.get('otp')
            if otp:
                # Replace with actual OTP verification logic
                if otp == "123456":  # Simulate OTP verification
                    return JsonResponse({'status': 'success', 'message': 'OTP verified successfully!'})
                else:
                    return JsonResponse({'status': 'error', 'message': 'Invalid OTP'}, status=400)
            else:
                return JsonResponse({'status': 'error', 'message': 'OTP not provided'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid request format'}, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


def reset_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_password = data.get('password')
            return JsonResponse({'status': 'success', 'message': 'Password reset successfully!'})
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid request format'}, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

class LeavePlanner(UserObjectMixins,View):
    async def get(self, request):
        try:
            employeeNo = await sync_to_async(request.session.__getitem__)(
                "Employee_No_"
            )
            async with aiohttp.ClientSession() as session:
                task_get_planners = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session,
                        "/QyLeavePlannerHeaders",
                        "Employee_No_",
                        "eq",
                        employeeNo,
                    )
                )
                response = await asyncio.gather(task_get_planners)
                plans = [x for x in response[0]]
                return JsonResponse(plans, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, safe=False)
        
    async def post(self, request):
        try:
            soap_headers = await sync_to_async(request.session.__getitem__)(
                "soap_headers"
            )
            employeeNo = await sync_to_async(request.session.__getitem__)(
                "Employee_No_"
            )
            plannerNo = request.POST.get("plannerNo")
            myAction = request.POST.get("myAction")

            response = self.make_soap_request(
                soap_headers,
                "FnLeavePlannerHeader",
                plannerNo,
                employeeNo,
                myAction,
            )
            if response != "0" and response != None and response != "":
                return JsonResponse({"code": response}, safe=False)
            return JsonResponse({"error": "Invalid response"}, safe=False)
        except Exception as e:
            logging.exception(e)
            return JsonResponse({"error": str(e)}, safe=False)


class FnLeavePlannerLine(UserObjectMixins, View):
    async def get(self, request, pk):
        try:
            employeeNo = await sync_to_async(request.session.__getitem__)(
                "Employee_No_"
            )
            Lines = []
            async with aiohttp.ClientSession() as session:
                task_get_training_lines = asyncio.ensure_future(
                    self.simple_double_filtered_data(
                        session,
                        "/QyLeavePlanLines",
                        "DocumentNo",
                        "eq",
                        pk,
                        "and",
                        "EmployeeNo",
                        "eq",
                        employeeNo,
                    )
                )

                response = await asyncio.gather(task_get_training_lines)
                Lines = [x for x in response[0]]
            return JsonResponse({"data": Lines}, safe=False)
        except Exception as e:
            logging.exception(e)
            return JsonResponse({"error": str(e)}, safe=False)

    async def post(self, request, pk):
        try:
            soap_headers = await sync_to_async(request.session.__getitem__)(
                "soap_headers"
            )
            data = json.loads(request.body)
            lineNo = int(data.get('lineNo', 0)) 
            startDate = dates.strptime(data.get('startDate'), "%Y-%m-%dT%H:%M:%S.%fZ")
            endDate = dates.strptime(data.get('endDate'), "%Y-%m-%dT%H:%M:%S.%fZ")
            myAction = data.get('MyAction')

            startDate = startDate.date()
            endDate = endDate.date()
        
            response = self.make_soap_request(
                soap_headers,
                "FnLeavePlannerLine",
                lineNo,
                pk,
                startDate,
                endDate,
                myAction,
            )
            if response == True:
                return JsonResponse({
                    "message": "Plan added successfully",
                }, status=201)
        except Exception as e:
            error_message = str(e)
            print(e)
            logging.exception(e)
            return JsonResponse({"error": error_message}, status=400) 

        
class FnAddLeavePlannerLine(UserObjectMixins, View):
    async def post(self, request, pk):
        try:
            soap_headers = await sync_to_async(request.session.__getitem__)(
                "soap_headers"
            )
            data = json.loads(request.body)
            lineNo = int(data.get('lineNo', 0)) 
            startDate = dates.strptime(data.get('startDate'), "%Y-%m-%d").date()
            endDate = dates.strptime(data.get('endDate'), "%Y-%m-%d").date()
            myAction = data.get('MyAction')
           
            response = self.make_soap_request(
                soap_headers,
                "FnLeavePlannerLine",
                lineNo,
                pk,
                startDate,
                endDate,
                myAction,
            )
            if response == True:
                return JsonResponse({
                    "message": "Plan added successfully",
                }, status=201)
        except Exception as e:
            print(e)
            logging.exception(e)
            return JsonResponse({"error": str(e)}, safe=False)

class FnSubmitLeavePlanner(UserObjectMixins, View):
    def post(self, request, pk=None):
        try:
            soap_headers = request.session["soap_headers"]
            employeeNo = request.session["Employee_No_"]
            response = self.make_soap_request(
                soap_headers, "FnSubmitLeavePlanner", pk, employeeNo
            )
            if response == True:
                return JsonResponse({"success": True, "message": "Plan submitted successfully!"})
        
        except Exception as e:
            print(e)
            return JsonResponse({"success": False, "error": str(e)}, status=500)
        


class NewLeave(UserObjectMixins,View):
    async def get(self, request):
        try:
            UserId = await sync_to_async(request.session.__getitem__)("User_ID")
            Leave = []
            async with aiohttp.ClientSession() as session:
                task_get_leave = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session,
                        "/QyLeaveApplications",
                        "User_ID",
                        "eq",
                        UserId,
                    )
                )
                response = await asyncio.gather(
                    task_get_leave,
                )
                Leave = [x for x in response[0]]
            return JsonResponse(Leave, safe=False)
        except Exception as e:
            print(e)
            return JsonResponse({"success": False, "error": str(e)}, status=500)
    async def post(self, request):
        try:
            
            soap_headers = await sync_to_async(request.session.__getitem__)(
                "soap_headers"
            )
            employeeNo = await sync_to_async(request.session.__getitem__)(
                "Employee_No_"
            )
            usersId = await sync_to_async(request.session.__getitem__)("User_ID")
            data = json.loads(request.body)
            application_no = data.get("applicationNo", "")
            my_action = data.get("myAction", "")
            leave_type = data.get("leaveType", "")
            leave_balance = data.get("leaveBalance", "")
            based_on_planner = eval(data.get("basedOnPlanner", ""))
            return_same_day = data.get("returnSameDay", "")
            planner_start_date = data.get("plannerStartDate", "")
            days_applied = data.get("daysApplied", "")
            half_of_day = data.get("halfOfDay", "")
            leaveStartDate = data.get("leaveStartDate", "")
            if based_on_planner == True:
                planner_start_date = dates.strptime(planner_start_date, "%Y-%m-%d").date()
            else:
                planner_start_date = dates.strptime(leaveStartDate, "%Y-%m-%d").date()

            if not days_applied:
                days_applied = 0

            if not half_of_day:
                half_of_day = 0

            if not return_same_day:
                return_same_day = "False"
            response = self.make_soap_request(
                soap_headers,
                "FnLeaveApplication",
                application_no,
                employeeNo,
                usersId,
                leave_type,
                based_on_planner,
                planner_start_date,
                float(days_applied),
                eval(return_same_day),
                int(half_of_day),
                my_action,
            )
            if response != "0" and response != None and response != "":
                return JsonResponse({"applicationNo": response}, safe=False)
            else:
                return JsonResponse({"error": str(response)}, safe=False)

        except Exception as e:
            print(str(e))
            return JsonResponse({"error": str(e)}, safe=False)

class LeaveBalance(UserObjectMixins, View):
    async def get(self, request):
        try:
            leave_type = request.GET.get('leaveType')

            soap_headers = await sync_to_async(request.session.__getitem__)(
                "soap_headers"
            )
            Employee_No_ = await sync_to_async(request.session.__getitem__)(
                "Employee_No_"
            )
            response = self.make_soap_request(
                soap_headers,
                "FnGetLeaveBalance",
                Employee_No_,
                leave_type,
            )
            return JsonResponse({"leaveBalance": response}, status=200)

        except Exception as e:
            logging.exception(e)
            return JsonResponse({"error": str(e)}, status=500)


class FnLeaveReliever(UserObjectMixins,View):
    async def get(self, request, pk):
        try:
            Relievers = []
            async with aiohttp.ClientSession() as session:
                task = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyLeaveRelievers", "LeaveCode", "eq", pk
                    )
                )
                response = await asyncio.gather(task)

                Relievers = [x for x in response[0]]
            return JsonResponse(Relievers, safe=False)
        except Exception as e:
            logging.exception(e)
            return JsonResponse({"error": str(e)}, safe=False)

    async def post(self, request, pk):
        try:
            soap_headers = await sync_to_async(request.session.__getitem__)(
                "soap_headers"
            )

            reliever = request.POST.get("reliever")
            my_action = request.POST.get("myAction")

            response = self.make_soap_request(
                    soap_headers, "FnLeaveReliever", pk, reliever, my_action
                )
            if response != "0" and response != None and response != "":
                return JsonResponse({"message": "Reliever added successfully!"})
        except Exception as e:
            logging.exception(e)
            return JsonResponse({"error": str(e)}, safe=False)


class FileUploadView(UserObjectMixins,View):
    async def get(self, request,pk):
        try:
            Attachments = []
            async with aiohttp.ClientSession() as session:
                task_get_attachments = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyDocumentAttachments", "No", "eq", pk
                    )
                )
                response = await asyncio.gather(task_get_attachments)
                Attachments = [x for x in response[0]]
            return JsonResponse(Attachments, safe=False)
        except Exception as e:
            logging.exception(e)
            return JsonResponse({"error": str(e)}, safe=False)
    async def post(self, request,pk):
        soap_headers = await sync_to_async(request.session.__getitem__)(
                "soap_headers"
            )
        files = request.FILES.getlist("files")
        if not files:
            return JsonResponse({"error": "No files provided."}, status=400)
        tableID = 50520
        attachment_names = []
        response = False
        for file in files:
                fileName = file.name
                attachment_names.append(fileName)
                attachment = base64.b64encode(file.read())
                response = self.upload_attachment(
                    soap_headers, pk, fileName, attachment, tableID
                )
        if response is not None:
            if response == True:
                message = "Uploaded {} attachments successfully".format(
                    len(files)
                )
                return JsonResponse({"message": message})
            error = "Upload failed: {}".format(response)
            return JsonResponse({"error":error}, status=400)
        error = "Upload failed: Response from server was None"
        return JsonResponse({"error":error}, status=400)

class LeaveApproval(UserObjectMixins, View):
    def post(self, request, pk=None):
        try:
            soap_headers = request.session.get("soap_headers")
            employeeNo = request.session.get("Employee_No_")

            if not soap_headers or not employeeNo:
                raise ValueError("Missing required session data.")

            response = self.make_soap_request(
                soap_headers, "FnRequestLeaveApproval", employeeNo, pk
            )

            if response is True:
                return JsonResponse({"success": True, "message": "Plan submitted successfully!"})
            else:
                return JsonResponse({"success": False, "error": str(response)}, status=400)

        except KeyError as e:
            error_message = f"Missing session key: {str(e)}"
            print(error_message)
            return JsonResponse({"success": False, "error": error_message}, status=400)

        except Exception as e:
            error_message = f"Unexpected error: {str(e)}"
            print(error_message)
            return JsonResponse({"success": False, "error": error_message}, status=500)


class LeaveApproversView(UserObjectMixins,View):
    async def get(self, request, pk):
        try:
            Approvers = []
            async with aiohttp.ClientSession() as session:
                task_get_leave_approvers = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyApprovalEntries", "DocumentNo", "eq", pk
                    )
                )
                response = await asyncio.gather(task_get_leave_approvers)

                Approvers = [x for x in response[0] if x["Status"] == "Open"]

            return JsonResponse(Approvers, safe=False)
        except Exception as e:
            logging.exception(e)
            return JsonResponse({"error": str(e)}, safe=False)
    
class LeaveAdjustments(UserObjectMixins, View):
    async def get(self, request):
        try:
            UserId = await sync_to_async(request.session.__getitem__)("User_ID")
            Adjustment = []
            async with aiohttp.ClientSession() as session:
                task = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session,
                        "/QyLeaveAdjustmentHeader",
                        "EnteredBy",
                        "eq",
                        UserId,
                    )
                )
                response = await asyncio.gather(
                    task,
                )
                Adjustment = [x for x in response[0]]
            return JsonResponse(Adjustment, safe=False)
        except Exception as e:
            print(e)
            return JsonResponse({"success": False, "error": str(e)}, status=500)
    async def post(self, request):
        try:
            soap_headers = await sync_to_async(request.session.__getitem__)(
                "soap_headers"
            )
            User_ID = await sync_to_async(request.session.__getitem__)("User_ID")
            data = json.loads(request.body)
            richText = data.get("richText")
            myAction = data.get("myAction")
            AdjustmentNo = data.get("AdjustmentNo")
            transType = 2
            response = self.make_soap_request(
                soap_headers,
                "FnLeaveAdjustment",
                AdjustmentNo,
                richText,
                transType,
                User_ID,
                myAction,
            )
            if response != None and response != "" and response != 0:
                return JsonResponse({"applicationNo": response}, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, safe=False)
    
class LeaveCancelApproval(UserObjectMixins, View):
    def post(self, request, pk=None):
        try:
            employeeNo = request.session["Employee_No_"]
            soap_headers = request.session["soap_headers"]

            response = self.make_soap_request(
                soap_headers, "FnCancelLeaveApproval", employeeNo, pk
            )
            if response == True:
                return JsonResponse({"success": True, "message": "Leave submission canceled successfully!"})            
        
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

class azure_ad_callback(UserObjectMixins, View):
    def get(self, request):
        try:
            code = request.GET.get("code")

            if code:
                token_url = f"https://login.microsoftonline.com/{config.AZURE_AD_TENANT_ID}/oauth2/v2.0/token"
                token_data = {
                    "grant_type": "authorization_code",
                    "code": code,
                    "scope": "https://graph.microsoft.com/.default",
                    "client_id": config.AZURE_AD_CLIENT_ID,
                    "client_secret": config.AZURE_AD_CLIENT_SECRET,
                    "redirect_uri": config.AZURE_AD_REDIRECT_URI,
                }

                token_response = requests.post(token_url, data=token_data)

                if token_response.status_code == 200:
                    token = token_response.json()
                    access_token = token.get("access_token")
                    graph_api_url = "https://graph.microsoft.com/v1.0/me"
                    headers = {
                        "Authorization": f"Bearer {access_token}",
                    }

                    response = requests.get(url=graph_api_url, headers=headers)

                    if response.status_code == 200:
                        user_data = response.json()

                        user_name = user_data.get("displayName")
                        user_email = user_data.get("userPrincipalName").lower()

                        users = self.one_filter(
                            "/QyUserSetup", "EMail", "eq", user_email
                        )
                        if users[0] == 0:
                            error_message = (
                                f"{user_email} does not exist in the user setup"
                            )
                            raise Exception(error_message)
                        else:
                            for user in users[1]:
                                missing_keys = [
                                    key
                                    for key in [
                                        "UserID",
                                        "HODUser",
                                    ]
                                    if key not in user
                                    or (user.get(key) is None or user.get(key) == "")
                                ]
                                if missing_keys:
                                    error_message = (
                                        f"Missing data for: {', '.join(missing_keys)}"
                                    )
                                    raise ValueError(error_message)
                                if (
                                    user["CustomerNo"] == None
                                    or user["CustomerNo"] == ""
                                ):
                                    request.session["Customer_No_"] = "None"
                                else:
                                    request.session["Customer_No_"] = user["CustomerNo"]
                                request.session["User_ID"] = user["UserID"]
                                if user["EMail"] == None or user["EMail"] == "":
                                    request.session["E_Mail"] = "None"
                                else:
                                    request.session["E_Mail"] = user["EMail"]
                                if user["PhoneNo"] == None or user["PhoneNo"] == "":
                                    request.session["PhoneNo"] = "None"
                                else:
                                    request.session["PhoneNo"] = user["PhoneNo"]
                                request.session["HOD_User"] = user["HODUser"]

                                soap_headers = {
                                    "username": config.WEB_SERVICE_UID,
                                    "password": config.WEB_SERVICE_PWD,
                                }
                                request.session["soap_headers"] = soap_headers

                                if (
                                    user["EmployeeNo"] == None
                                    or user["EmployeeNo"] == ""
                                ):
                                    request.session["full_name"] = user["UserID"]
                                    request.session["open_leave_count"] = 0
                                    request.session["open_leave_applications"] = 0
                                    request.session["Department"] = "None"
                                    request.session["Employee"] = False
                                    messages.success(
                                        request,
                                        f"Success. Logged in as {request.session['User_ID']}",
                                    )
                                    return redirect("Approval")
                                else:
                                    request.session["Employee_No_"] = user["EmployeeNo"]
                                    request.session["Employee"] = True

                                Employee_No_ = request.session["Employee_No_"]
                                User_ID = request.session["User_ID"]

                                employees = self.one_filter(
                                    "/QyEmployees", "No_", "eq", Employee_No_
                                )

                                if employees[0] == 0:
                                    error_message = f"{Employee_No_} does not exist in the employees setup"
                                    raise Exception(error_message)
                                else:
                                    task_get_leave = self.one_filter(
                                        "/QyLeaveApplications",
                                        "User_ID",
                                        "eq",
                                        User_ID,
                                    )
                                    open_leave_count = len(
                                        [
                                            x
                                            for x in task_get_leave[1]
                                            if x["Status"] == "Open"
                                        ]
                                    )

                                    open_leave_applications = []

                                    if open_leave_count > 0:
                                        open_leave_applications = [
                                            x["Application_No"]
                                            for x in employees[1]
                                            if x["Status"] == "Open"
                                        ]

                                        request.session[
                                            "open_leave_applications"
                                        ] = open_leave_applications
                                    request.session[
                                        "open_leave_count"
                                    ] = open_leave_count
                                    for employee in employees[1]:
                                        missing_keys = [
                                            key
                                            for key in [
                                                "First_Name",
                                            ]
                                            if key not in employee
                                            or (
                                                employee.get(key) is None
                                                or employee.get(key) == ""
                                            )
                                        ]
                                        if missing_keys:
                                            error_message = f"Missing data for: {', '.join(missing_keys)}"
                                            raise ValueError(error_message)
                                        request.session["First_Name"] = employee.get(
                                            "First_Name", "None"
                                        )

                                        # Set Middle_Name
                                        middle_name = employee.get("Middle_Name", "")
                                        if middle_name == "":
                                            middle_name = "None"
                                        request.session["Middle_Name"] = middle_name

                                        # Set Last_Name
                                        last_name = employee.get("Last_Name", "")
                                        if last_name == "":
                                            last_name = "None"
                                        request.session["Last_Name"] = last_name

                                        # Create full_name
                                        full_name = employee["First_Name"]
                                        if middle_name != "None":
                                            full_name += " " + middle_name
                                        if last_name != "None":
                                            full_name += " " + last_name
                                        request.session["full_name"] = full_name

                                        if (
                                            employee["Global_Dimension_1_Code"] == None
                                            or employee["Global_Dimension_1_Code"] == ""
                                        ):
                                            request.session["sectionCode"] = "None"
                                        else:
                                            request.session["sectionCode"] = employee[
                                                "Global_Dimension_1_Code"
                                            ]

                                        if (
                                            employee["Global_Dimension_2_Code"] == None
                                            or employee["Global_Dimension_2_Code"] == ""
                                        ):
                                            request.session["Department"] = "None"
                                        else:
                                            request.session["Department"] = employee[
                                                "Global_Dimension_2_Code"
                                            ]

                                        if (
                                            employee["Supervisor_Title"] == None
                                            or employee["Supervisor_Title"] == ""
                                        ):
                                            request.session["Supervisor_Title"] = "None"

                                        else:
                                            request.session[
                                                "Supervisor_Title"
                                            ] = employee["Supervisor_Title"]

                                        if (
                                            employee["Supervisor"] == None
                                            or employee["Supervisor"] == ""
                                        ):
                                            request.session["Supervisor"] = "None"

                                        else:
                                            request.session["Supervisor"] = employee[
                                                "Supervisor"
                                            ]

                                        if (
                                            employee["Job_Position"] == None
                                            or employee["Job_Position"] == ""
                                        ):
                                            request.session[
                                                "Job_Position"
                                            ] = "Job Position"
                                        else:
                                            request.session["Job_Position"] = employee[
                                                "Job_Position"
                                            ]

                                        if (
                                            employee["Job_Title"] == None
                                            or employee["Job_Title"] == ""
                                        ):
                                            request.session["Job_Title"] = "Job Title"
                                        else:
                                            request.session["Job_Title"] = employee[
                                                "Job_Title"
                                            ]
                                        messages.success(
                                            request,
                                            f"Success. Logged in as {request.session['full_name']}",
                                        )
                                        saved_url = request.session.get("saved_url")
                                        if saved_url is not None:
                                            if "saved_url" in request.session:
                                                del request.session["saved_url"]

                                            return HttpResponseRedirect(saved_url)
                                        else:
                                            return redirect("dashboard")
                                    error_message = f"{Employee_No_} does not exist in the employees setup"
                                    raise Exception(error_message)

                            error_message = (
                                f"{user_email} does not exist in the user setup"
                            )
                            raise Exception(error_message)

                    else:
                        error_message = f"Graph API Error: {response.text}"
                        raise Exception(error_message)

                else:
                    error_message = f"Token Exchange Error: {token_response.text}"
                    raise Exception(error_message)
        except Exception as e:
            print(e)
            messages.error(request, f"{e}")
            return redirect("Login")


class Login(UserObjectMixins, View):
    async def get(self, request):
        return render(request, "index.html")

def logout(request):
    if request.method == "POST":
        request.session.flush()
        return JsonResponse({"message": "Logged out successfully"}, status=200)
    return JsonResponse({"error": "Invalid request method"}, status=400)


class DashboardData(UserObjectMixins, View):
    async def get(self, request):
        try:
            UserId = await sync_to_async(request.session.__getitem__)("User_ID")
            full_name = await sync_to_async(request.session.__getitem__)("full_name")
            open_leave_count = await sync_to_async(request.session.__getitem__)(
                "open_leave_count"
            )
            Employee_No_ = await sync_to_async(request.session.__getitem__)("Employee_No_")
            E_Mail = await sync_to_async(request.session.__getitem__)("E_Mail")
            PhoneNo = await sync_to_async(request.session.__getitem__)("PhoneNo")
            HOD_User = await sync_to_async(request.session.__getitem__)("HOD_User")
            First_Name = await sync_to_async(request.session.__getitem__)("First_Name")
            Middle_Name = await sync_to_async(request.session.__getitem__)("Middle_Name")
            Last_Name = await sync_to_async(request.session.__getitem__)("Last_Name")
            sectionCode = await sync_to_async(request.session.__getitem__)("sectionCode")
            Department = await sync_to_async(request.session.__getitem__)("Department")
            Supervisor_Title = await sync_to_async(request.session.__getitem__)("Supervisor_Title")
            Supervisor = await sync_to_async(request.session.__getitem__)("Supervisor")
            Job_Position = await sync_to_async(request.session.__getitem__)("Job_Position")
            Job_Title = await sync_to_async(request.session.__getitem__)("Job_Title")
            user_data = {
                "full_name":full_name,
                "open_leave_count":open_leave_count,
                "Employee_No_":Employee_No_,
                "E_Mail":E_Mail,
                "PhoneNo":PhoneNo,
                "HOD_User":HOD_User,
                "First_Name":First_Name,
                "Middle_Name":Middle_Name,
                "Last_Name":Last_Name,
                "sectionCode":sectionCode,
                "Department":Department,
                "Supervisor_Title":Supervisor_Title,
                "Supervisor":Supervisor,
                "Job_Position":Job_Position,
                "Job_Title":Job_Title,
            }

            openLeave = []
            approvedLeave = []
            Rejected = []
            pendingLeave = []
            Document_Types = [
                "19",
                "20",
            ]

            async with aiohttp.ClientSession() as session:
                task_get_leave = asyncio.ensure_future(
                    self.fetch_one_filtered_data(
                        session, "/QyLeaveApplications", "User_ID", "eq", UserId
                    )
                )
                task_open_approvals = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyApprovalEntries", "ApproverID", "eq", UserId
                    )
                )
                response = await asyncio.gather(task_get_leave, task_open_approvals)

                openLeave = [x for x in response[0]["data"] if x["Status"] == "Open"]
                pendingLeave = [
                    x for x in response[0]["data"] if x["Status"] == "Pending Approval"
                ]
                approvedLeave = [
                    x for x in response[0]["data"] if x["Status"] == "Released"
                ]
                Rejected = [x for x in response[0]["data"] if x["Status"] == "Rejected"]
                open_approvals = [
                    x
                    for x in response[1]
                    if x["Status"] == "Open" and x["DocumentType"] in Document_Types
                ]
            leave_data = {
                "openLeave": len(openLeave),
                "pendingLeave": len(pendingLeave),
                "approvedLeave": len(approvedLeave),
                "Rejected": len(Rejected),
            }
            dashboard_data = {
                "open_approvals": open_approvals,
                "leave_data": leave_data,
                "user_data": user_data,
            }
            return JsonResponse(dashboard_data)
        except KeyError as e:
            print(e)
            return JsonResponse({"error": f"Missing session key: {str(e)}"}, status=400)
        
class get_leave_types(UserObjectMixins, View):
    async def get(self, request):
        try:
            async with aiohttp.ClientSession() as session:
                task1 = asyncio.ensure_future(
                    self.simple_fetch_data(session, "/QyLeaveTypes")
                )

                response = await asyncio.gather(
                    task1,

                )
                LeaveTypes = [x for x in response[0]]
                return JsonResponse(LeaveTypes, safe=False)
        except Exception as e:
            return JsonResponse({"error": f"Missing session key: {str(e)}"}, status=400)
        
class LeavePlanners(UserObjectMixins, View):
    async def get(self, request):
        try:
            
            employeeNo = await sync_to_async(request.session.__getitem__)(
                "Employee_No_"
            )
            
            async with aiohttp.ClientSession() as session:
                task_planner = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyLeavePlanLines", "EmployeeNo", "eq", employeeNo
                    )
                )

                task_planner_header = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session,
                        "/QyLeavePlannerHeaders",
                        "Employee_No_",
                        "eq",
                        employeeNo,
                    )
                )

                response = await asyncio.gather(
                    task_planner,
                    task_planner_header,
                )
                Plan_Header = [x for x in response[1] if x["Submitted"] == True]
                No_Values = [x["No_"] for x in Plan_Header]

                Plan_Lines = [x for x in response[0] if x["DocumentNo"] in No_Values]
                
                return JsonResponse(Plan_Lines, safe=False)

        except Exception as e:
            return JsonResponse({"error": f"Missing session key: {str(e)}"}, status=400)
        
class NumberOfDaysFilter(UserObjectMixins, View):
    async def get(self, request):
        try:
            planner_date = request.GET.get("start_date", None)
            number_of_days = 0
            employeeNo = await sync_to_async(request.session.__getitem__)(
                "Employee_No_"
            )
            async with aiohttp.ClientSession() as session:
                task = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyLeavePlanLines", "EmployeeNo", "eq", employeeNo
                    )
                )
                response = await asyncio.gather(task)

                for day in response[0]:
                    if day["StartDate"] == planner_date:
                        number_of_days = day["Days"]
                return JsonResponse(number_of_days, safe=False)

        except Exception as e:
            logging.exception(e)
            return JsonResponse({"error": str(e)}, safe=False)
        
class get_leave_employees(UserObjectMixins, View):
    async def get(self, request):
        try:
            Department = await sync_to_async(request.session.__getitem__)("sectionCode")
            employeeNo = await sync_to_async(request.session.__getitem__)(
                "Employee_No_"
            )
            if "&" in Department:
                Department = Department.replace("&", "%26")
            async with aiohttp.ClientSession() as session:
                task_get_relievers = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session,
                        "/QyEmployees",
                        "Global_Dimension_1_Code",
                        "eq",
                        Department,
                    )
                )

                response = await asyncio.gather(
                    task_get_relievers,
                )
                relievers = [x for x in response[0] if x["No_"] != employeeNo]
                return JsonResponse(relievers, safe=False)
        except Exception as e:
            return JsonResponse({"error": f"Missing session key: {str(e)}"}, status=400)
        
class LeaveAdjustmentLine(UserObjectMixins, View):
    async def get(self, request, pk):
        try:
            lines = []
            async with aiohttp.ClientSession() as session:
                task = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyLeaveAdjustmentLines", "HeaderNo", "eq", pk
                    )
                )

                response = await asyncio.gather(task)
                lines = [x for x in response[0]]
            return JsonResponse({"data": lines}, safe=False)
        except Exception as e:
            logging.exception(e)
            return JsonResponse({"error": str(e)}, safe=False)

    async def post(self, request, pk):
        try:
            soap_headers = await sync_to_async(request.session.__getitem__)(
                "soap_headers"
            )
            employeeNo = await sync_to_async(request.session.__getitem__)(
                "Employee_No_"
            )
            data = json.loads(request.body)
            lineNo = int(data.get('lineNo', 0)) 
            leaveType = data.get('leaveType')
            transType = int(data.get('transType'))
            entitlementAdj = float(data.get('entitlementAdj'))
            myAction = data.get('myAction')
           
            response = self.make_soap_request(
                soap_headers,
                "FnLeaveAdjustmentLine",
                lineNo,
                pk,
                employeeNo,
                leaveType,
                transType,
                entitlementAdj,
                myAction,
            )
            if response == True:
                return JsonResponse({
                    "message": "Plan added successfully",
                }, status=201)
        except Exception as e:
            print(e)
            logging.exception(e)
            return JsonResponse({"error": str(e)}, safe=False)
        
class FnRequestLeaveAdjustmentApproval(UserObjectMixins, View):
    async def post(self, request, pk):
        try:
            soap_headers = await sync_to_async(request.session.__getitem__)(
                "soap_headers"
            )
            response = self.make_soap_request(
                soap_headers,
                "FnRequestLeaveAdjustmentApproval",
                pk,
            )
            if response == True:
                return JsonResponse({"success": True, "message": "submitted successfully!"})
            return JsonResponse({"success": False, "error": str(response)}, status=400)
        
        except Exception as e:
            print(str(e))
            return JsonResponse({"success": False, "error": str(e)}, status=500)
        
class AdjustmentApproversView(UserObjectMixins, View):
    async def get(self, request, pk):
        try:
            Approvers = []
            async with aiohttp.ClientSession() as session:
                task_get__approvers = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyApprovalEntries", "DocumentNo", "eq", pk
                    )
                )

                response = await asyncio.gather(task_get__approvers)

                Approvers = [x for x in response[0] if x["Status"] == "Open"]

            return JsonResponse(Approvers, safe=False)
        except Exception as e:
            logging.exception(e)
            return JsonResponse({"error": str(e)}, safe=False)
        
class FnCancelLeaveAdjustmentApproval(UserObjectMixins, View):
    async def post(self, request, pk):
        try:
            soap_headers = await sync_to_async(request.session.__getitem__)(
                "soap_headers"
            )
            response = self.make_soap_request(
                soap_headers,
                "FnCancelLeaveAdjustmentApproval",
                pk,
            )
            if response == True:
                return JsonResponse({"success": True, "message": "submission canceled successfully!"})            
        
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
        
class FnReOpenLeavePlanner(UserObjectMixins, View):
    def post(self, request, pk):
        try:
            soap_headers = request.session["soap_headers"]
            employeeNo = request.session["Employee_No_"]
            response = self.make_soap_request(
                soap_headers, "FnReOpenLeavePlanner", pk, employeeNo
            )
            if response == True:
                return JsonResponse({"success": True, "message": "Plan ReOpened successfully!"})
        except Exception as e:
            print(e)
            return JsonResponse({"success": False, "error": str(e)}, status=500)
        
class HRLeaveReports(UserObjectMixins, View):
    async def post(self, request):
        try:
            soap_headers = await sync_to_async(request.session.__getitem__)(
                "soap_headers"
            )
            employeeNo = await sync_to_async(request.session.__getitem__)(
                "Employee_No_"
            )
            data = json.loads(request.body)
            document_type = int(data.get('document_type')) 
            documentID = data.get("documentID")

            today_date = datetime.datetime.now().strftime("%Y-%m-%d")

            if document_type == 1:
                filenameFromApp = f"Leave_Statement_{today_date}.pdf"
                response = self.make_soap_request(
                    soap_headers,
                    "FnGenerateLeaveStatement",
                    employeeNo,
                    filenameFromApp,
                    "",
                )
            elif document_type == 2:
                filenameFromApp = f"Leave_Report_{today_date}.pdf"
                response = self.make_soap_request(
                    soap_headers,
                    "FnGenerateLeaveReport",
                    employeeNo,
                    filenameFromApp,
                    documentID,
                )
            elif document_type == 3:
                sectionCode = await sync_to_async(request.session.__getitem__)(
                    "sectionCode"
                )
                departmentCode = await sync_to_async(request.session.__getitem__)(
                    "Department"
                )
                supervisorEmployeeNo = await sync_to_async(request.session.__getitem__)(
                    "Supervisor"
                )
                supervisorTitle = await sync_to_async(request.session.__getitem__)(
                    "Supervisor_Title"
                )
                filenameFromApp = f"Leave_Summary_Report_{today_date}.pdf"
                response = self.make_soap_request(
                    soap_headers,
                    "FnGenerateLeaveSummaryReport",
                    employeeNo,
                    filenameFromApp,
                    sectionCode,
                    departmentCode,
                    supervisorEmployeeNo,
                    supervisorTitle,
                )

            buffer = BytesIO.BytesIO()
            content = base64.b64decode(response)
            buffer.write(content)
            buffer.seek(0)

            pdf_data = base64.b64encode(buffer.getvalue()).decode('utf-8')
            return JsonResponse({"success": True, "pdf_data": pdf_data, "filename": filenameFromApp})
        except Exception as e:
            print(e)
            return JsonResponse({"success": False, "error": str(e)}, status=500)

class Approval(UserObjectMixins, View):
    async def get(self, request):
        try:
            approvals = []
            User_ID = await sync_to_async(request.session.__getitem__)("User_ID")
            Document_Types = [
                "18",
                "20",
                "25",
            ]
            async with aiohttp.ClientSession() as session:
                task_open_approvals = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyApprovalEntries", "ApproverID", "eq", User_ID
                    )
                )
                response = await asyncio.gather(task_open_approvals)

                approvals = [
                    x
                    for x in response[0]
                    if  x["DocumentType"] in Document_Types
                ]
            return JsonResponse(approvals, safe=False)

        except Exception as e:
            print(e)
            return JsonResponse({"success": False, "error": str(e)}, status=500)

class DashboardReports(UserObjectMixins, View):
    async def post(self, request):
        try:
            soap_headers = await sync_to_async(request.session.__getitem__)(
                "soap_headers"
            )
            employeeNo = await sync_to_async(request.session.__getitem__)(
                "Employee_No_"
            )

            today_date = datetime.datetime.now().strftime("%Y-%m-%d")

            filenameFromApp = f"Leave_Statement_{today_date}.pdf"
            response = self.make_soap_request(
                soap_headers,
                "FnGenerateLeaveStatement",
                employeeNo,
                filenameFromApp,
                "",
            )

            buffer = BytesIO.BytesIO()
            content = base64.b64decode(response)
            buffer.write(content)
            buffer.seek(0)

            pdf_data = base64.b64encode(buffer.getvalue()).decode('utf-8')
            return JsonResponse({"success": True, "pdf_data": pdf_data, "filename": filenameFromApp})
        except Exception as e:
            print(e)
            return JsonResponse({"success": False, "error": str(e)}, status=500)
        
class FnGetAnnualLeaveDashboard(UserObjectMixins, View):
    async def get(self, request):
        try:
            soap_headers = await sync_to_async(request.session.__getitem__)(
                "soap_headers"
            )
            Employee_No_ = await sync_to_async(request.session.__getitem__)(
                "Employee_No_"
            )
            response = self.make_soap_request(
                soap_headers, "FnGetAnnualLeaveDashboard", Employee_No_, 0, 0, 0, 0, 0
            )

            response_dict = {
                "availableMaxOverdraft": float(response.availableMaxOverdraft),
                "leaveEarnedToDate": float(response.leaveEarnedToDate),
                "balanceBF": float(response.balanceBF),
                "daysTakenToDate": float(response.daysTakenToDate),
                "recalledDays": float(response.recalledDays),
            }

            sorted_data = json.dumps(response_dict, indent=3)

            return JsonResponse(response_dict, safe=False)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
        
class ApproveLeaveDetails(UserObjectMixins, View):
    async def get(self, request, pk):
        try:
            data = {}

            async with aiohttp.ClientSession() as session:
                task = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyLeaveApplications", "Application_No", "eq", pk
                    )
                )
                response = await asyncio.gather(
                    task
                )
                for leave in response[0]:
                    data = leave
            return JsonResponse(data, safe=False)

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
        
class ApproveAdjustmentDetails(UserObjectMixins, View):
    async def get(self, request, pk):
        try:
            data = {}

            async with aiohttp.ClientSession() as session:
                task = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyLeaveAdjustmentHeader", "Code", "eq", pk
                    )
                )
                response = await asyncio.gather(
                    task
                )
                for adjustment in response[0]:
                    data = adjustment
            return JsonResponse(data, safe=False)

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
        
class ApproveRecallDetails(UserObjectMixins, View):
    async def get(self, request, pk):
        try:
            data = {}

            async with aiohttp.ClientSession() as session:
                task = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyLeaveRecalls", "No", "eq", pk
                    )
                )
                response = await asyncio.gather(
                    task
                )
                for recall in response[0]:
                    data = recall
            return JsonResponse(data, safe=False)

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
        
class FnActionApprovals(UserObjectMixins, View):
    def post(self, request, pk=None):
        try:
            soap_headers = request.session.get("soap_headers")
            User_ID = request.session.get("User_ID")

            if not soap_headers or not User_ID:
                return JsonResponse({"success": False, "error": "Unauthorized"}, status=403)

            data = json.loads(request.body)
            TableID = data.get("TableID")
            Entry_No_ = data.get("Entry_No_")
            statusApproveRejectDelegate = data.get("statusApproveRejectDelegate")
            approvalComment = data.get("approvalComment")

            # Validate required fields
            if not all([TableID, Entry_No_, statusApproveRejectDelegate]):
                return JsonResponse({"success": False, "error": "Missing required fields"}, status=400)

            # Ensure type casting doesn't fail
            try:
                TableID = int(TableID)
                Entry_No_ = int(Entry_No_)
            except ValueError:
                return JsonResponse({"success": False, "error": "Invalid TableID or Entry_No_"}, status=400)

            # Call SOAP service
            response = self.make_soap_request(
                soap_headers,
                "FnActionApprovals",
                TableID,
                pk,
                Entry_No_,
                statusApproveRejectDelegate,
                approvalComment,
            )
            if response and response != "0":
                return JsonResponse({"success": True, "message": "Approved successfully!"})
            return JsonResponse({"success": False, "error": str(response)}, status=400)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"success": False, "error": "An unexpected error occurred"}, status=500)

class LeaveBalances(UserObjectMixins, View):
    async def get(self, request):
        try:
            
            supervisor = request.session["Employee_No_"]
            
            balances = []
            async with aiohttp.ClientSession() as session:
                task_get_leave_balances = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyEmployees", "Supervisor", "eq", supervisor
                    )
                )
                
                response = await asyncio.gather(task_get_leave_balances)

                balances = [x for x in response[0] if x["Status"] == "Active"]

            return JsonResponse(balances, safe=False)

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
        
class LeaveDashboard(UserObjectMixins, View):
    async def get(self, request):
        try:
            Department = await sync_to_async(request.session.__getitem__)("Department")
            ctx = {}

            if "&" in Department:
                Department = Department.replace("&", "%26")

            async with aiohttp.ClientSession() as session:
                department_employees = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session,
                        "/QyEmployees",
                        "Global_Dimension_2_Code",
                        "eq",
                        Department,
                    )
                )
                get_leave = asyncio.ensure_future(
                    self.simple_one_filtered_data(
                        session, "/QyLeaveApplications", "Status", "eq", "Released"
                    )
                )
                response = await asyncio.gather(
                     department_employees, get_leave
                )

                employees = [x for x in response[0]]
                user_ids = [employee["User_ID"] for employee in employees]

                department_leave = [x for x in response[1] if x["User_ID"] in user_ids]

                today = datetime.date.today()

                future_department_leave = [
                    x
                    for x in department_leave
                    if datetime.datetime.strptime(
                        x["Resumption_Date"], "%Y-%m-%d"
                    ).date()
                    > today
                ]

                start_date_passed_leave = [
                    x
                    for x in future_department_leave
                    if datetime.datetime.strptime(x["Start_Date"], "%Y-%m-%d").date()
                    <= today
                ]

                planned_department_leave = [
                    x
                    for x in department_leave
                    if datetime.datetime.strptime(
                        x["Resumption_Date"], "%Y-%m-%d"
                    ).date()
                    > today
                    and x["Use_Planner"] == True
                ]

                un_planned_department_leave = [
                    x
                    for x in department_leave
                    if datetime.datetime.strptime(
                        x["Resumption_Date"], "%Y-%m-%d"
                    ).date()
                    > today
                    and x["Use_Planner"] == False
                ]

                if "%26" in Department:
                    Department = Department.replace("%26", "&")

                ctx = {
                    "department_leave": future_department_leave,
                    "planned_department_leave": planned_department_leave,
                    "start_date_passed_leave": start_date_passed_leave,
                    "un_planned_department_leave": un_planned_department_leave,
                }
            return JsonResponse(ctx, safe=False)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)