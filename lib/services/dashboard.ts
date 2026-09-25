import { get, unauth_add, getIpgReportNew, auth_add } from "./common";

// Portal Login API
export const sign = async (body: any) => {
  return await unauth_add("organization/portal/login/", body);
};

// Get All Events API
export const getALLevent = async () => {
  try {
    const data = await get("organization/dashboard/events/");
    return data;
  } catch (error) {
    return error;
  }
};

// Get Event Details by Event ID
export const getEventDetails = async (eventId: string | number) => {
  try {
    const data = await get(`organization/dashboard/event-detail/?id=${eventId}`);
    return data;
  } catch (error) {
    return error;
  }
};

// Get Event Participants
export const getPartiDetails = async (params: string) => {
  return await get("organization/dashboard/event-participants/?" + params);
};

// Get Dashboard List / Notifications
export const getNotifiesDetails = async (params: string) => {
  return await get("organization/dashboard/list-dashboard/?" + params);
};

// Get Event Participant Detail by ID
export const getDetailsById = async (params: string) => {
  return await get("organization/dashboard/event-participant-detail/?" + params);
};

// Get Event Gate Checking Status
export const getEventS = async (params: string) => {
  return await get("organization/dashboard/event-checking-status/?" + params);
};

// Get Event Sales Volume
export const geteventVolume = async (params: string) => {
  try {
    const data = await get("organization/dashboard/event-volume/?" + params);
    return data;
  } catch (error) {
    return error;
  }
};

// Download Event Report
export const download = async (params: string) => {
  const endpoint = `organization/dashboard/report/?event_id=${params}`;
  return await getIpgReportNew(endpoint);
};

// Download Notify Report
export const downloadNotifyReport = async (params: string) => {
  const endpoint = `organization/dashboard/notify_report/?event_details=${params}`;
  return await getIpgReportNew(endpoint);
};

// Resend Event Confirmation
export const reSend = async (params: string) => {
  return await get("organization/dashboard/resend-event-confirmation?" + params);
};

// Get Tickets by Slot
export const getTickent = async (params: string) => {
  return await get("organization/dashboard/tickets-by-slot/?" + params);
};

// Refund Request
export const refundRequest = async (transactionId: string) => {
  return await auth_add("organization/dashboard/refund-request/", {
    transaction_id: transactionId,
  });
};
