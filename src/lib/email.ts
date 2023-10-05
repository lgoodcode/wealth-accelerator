type SMTP2GoResponseError = {
  request_id: string;
  data: {
    error: string;
    error_code: string;
  };
};

type SMTP2GoResponseSuccess = {
  request_id: string;
  data: {
    succeeded: number;
    failed: number;
  };
};

type SMTP2GoResponse = SMTP2GoResponseError | SMTP2GoResponseSuccess;

type Recipients = {
  name: string;
  email: string;
};

export type TemplateData = Record<string, string>;

const SMTP2GO_API_URL = process.env.SMTP2GO_API_URL;
const EMAIL_SENDER = process.env.EMAIL_SENDER;

export const createEmailBody = <T extends TemplateData>(
  recipients: Recipients[],
  template_id: string,
  template_data: T
) => {
  return JSON.stringify({
    api_key: process.env.SMTP2GO_API_KEY,
    to: recipients.map((recipient) => `${recipient.name} <${recipient.email}>`),
    sender: EMAIL_SENDER,
    template_id,
    template_data,
  });
};

export const sendEmail = async (email_body: string): Promise<SMTP2GoResponseSuccess> => {
  const response = await fetch(SMTP2GO_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: email_body,
  });

  const res = (await response.json()) as SMTP2GoResponse;

  if ('error' in res.data) {
    throw new Error(res.data.error);
  } else {
    return res as SMTP2GoResponseSuccess;
  }
};
