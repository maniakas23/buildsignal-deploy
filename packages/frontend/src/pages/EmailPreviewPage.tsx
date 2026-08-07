import { useState, useCallback } from "react";
import {
  Mail,
  Copy,
  Send,
  Eye,
  ChevronRight,
  Sparkles,
  Zap,
  BarChart,
  Shield,
  CheckCircle2,
  Code2,
  ChevronDown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  EMAIL TEMPLATES (table-based layout, inline CSS)                   */
/* ------------------------------------------------------------------ */

const COMMON_FOOTER = `<tr>
  <td style="padding:24px 32px 32px;border-top:1px solid #e5e7eb;">
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9CA3AF;line-height:1.5;text-align:center;">
      You\'re receiving this because you signed up at <a href="https://buildsignal.net" style="color:#1F5EFF;text-decoration:none;">buildsignal.net</a>
    </p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9CA3AF;line-height:1.5;text-align:center;">
      <a href="#" style="color:#1F5EFF;text-decoration:none;">Unsubscribe</a> &nbsp;|&nbsp; <a href="#" style="color:#1F5EFF;text-decoration:none;">Update Preferences</a>
    </p>
  </td>
</tr>`;

const email1Welcome = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to BuildSignal</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F3F4F6;">
    <tr><td style="padding:24px 0;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:600px;width:100%;margin:0 auto;background-color:#FFFFFF;border-radius:8px;overflow:hidden;border:1px solid #E5E7EB;">
        <tr>
          <td style="padding:40px 32px 0;background-color:#0B1F33;text-align:center;">
            <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#1F5EFF;letter-spacing:2px;text-transform:uppercase;">BUILDSIGNAL</p>
            <h1 style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;color:#FFFFFF;line-height:1.2;">Welcome to BuildSignal</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 16px;">
            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#374151;line-height:1.6;">Hi {{firstName}},</p>
            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#374151;line-height:1.6;">Thanks for joining. You\'re now set up to track construction opportunities across your selected markets. Here\'s what happens next:</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0;">
              <tr>
                <td style="padding:12px 16px;background-color:#F9FAFB;border-radius:6px;border-left:3px solid #1F5EFF;">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;line-height:1.5;"><strong style="color:#111827;">1.</strong> We\'ll monitor permits in real-time across your selected counties.</p>
                </td>
              </tr>
              <tr><td style="height:8px;"></td></tr>
              <tr>
                <td style="padding:12px 16px;background-color:#F9FAFB;border-radius:6px;border-left:3px solid #1F5EFF;">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;line-height:1.5;"><strong style="color:#111827;">2.</strong> You\'ll get alerts when opportunities match your criteria.</p>
                </td>
              </tr>
              <tr><td style="height:8px;"></td></tr>
              <tr>
                <td style="padding:12px 16px;background-color:#F9FAFB;border-radius:6px;border-left:3px solid #1F5EFF;">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;line-height:1.5;"><strong style="color:#111827;">3.</strong> You can upgrade anytime for more markets and advanced features.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 32px;text-align:center;">
            <a href="https://buildsignal.net/dashboard" style="display:inline-block;padding:14px 32px;background-color:#1F5EFF;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">Go to Dashboard</a>
          </td>
        </tr>
        ${COMMON_FOOTER}
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const email2GettingStarted = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Getting Started with BuildSignal</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F3F4F6;">
    <tr><td style="padding:24px 0;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:600px;width:100%;margin:0 auto;background-color:#FFFFFF;border-radius:8px;overflow:hidden;border:1px solid #E5E7EB;">
        <tr>
          <td style="padding:40px 32px 0;background-color:#0B1F33;">
            <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#1F5EFF;letter-spacing:2px;text-transform:uppercase;">BUILDSIGNAL</p>
            <h1 style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#FFFFFF;line-height:1.2;">Getting Started: 3 ways to win with BuildSignal</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 16px;">
            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#374151;line-height:1.6;">Hi {{firstName}},</p>
            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#374151;line-height:1.6;">Day 2 tip: Set up your watchlists. Save projects you\'re tracking and get notified of status changes. Also: try filtering by sector and permit value to find the deals that match your investment criteria.</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0;">
              <tr>
                <td width="33%" style="padding:8px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F9FAFB;border-radius:8px;padding:16px;">
                    <tr><td style="text-align:center;padding-bottom:8px;">
                      <span style="display:inline-block;width:40px;height:40px;background-color:#0B1F33;border-radius:8px;line-height:40px;text-align:center;color:#1F5EFF;font-size:20px;">&#128065;</span>
                    </td></tr>
                    <tr><td style="text-align:center;">
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#111827;">Watchlists</p>
                      <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;line-height:1.4;">Save and track projects that matter to {{company}}.</p>
                    </td></tr>
                  </table>
                </td>
                <td width="33%" style="padding:8px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F9FAFB;border-radius:8px;padding:16px;">
                    <tr><td style="text-align:center;padding-bottom:8px;">
                      <span style="display:inline-block;width:40px;height:40px;background-color:#0B1F33;border-radius:8px;line-height:40px;text-align:center;color:#1F5EFF;font-size:20px;">&#128269;</span>
                    </td></tr>
                    <tr><td style="text-align:center;">
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#111827;">Filters</p>
                      <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;line-height:1.4;">Filter by sector and permit value to find deals.</p>
                    </td></tr>
                  </table>
                </td>
                <td width="33%" style="padding:8px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F9FAFB;border-radius:8px;padding:16px;">
                    <tr><td style="text-align:center;padding-bottom:8px;">
                      <span style="display:inline-block;width:40px;height:40px;background-color:#0B1F33;border-radius:8px;line-height:40px;text-align:center;color:#1F5EFF;font-size:20px;">&#128227;</span>
                    </td></tr>
                    <tr><td style="text-align:center;">
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#111827;">Alerts</p>
                      <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;line-height:1.4;">Get real-time notifications for status changes.</p>
                    </td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 32px;text-align:center;">
            <a href="https://buildsignal.net/watchlists" style="display:inline-block;padding:14px 32px;background-color:#1F5EFF;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">Set Up Watchlists</a>
          </td>
        </tr>
        ${COMMON_FOOTER}
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const email3FirstReport = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Weekly Report</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F3F4F6;">
    <tr><td style="padding:24px 0;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:600px;width:100%;margin:0 auto;background-color:#FFFFFF;border-radius:8px;overflow:hidden;border:1px solid #E5E7EB;">
        <tr>
          <td style="padding:40px 32px 0;background-color:#0B1F33;">
            <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#1F5EFF;letter-spacing:2px;text-transform:uppercase;">BUILDSIGNAL</p>
            <h1 style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#FFFFFF;line-height:1.2;">Your first weekly intelligence report is ready</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 16px;">
            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#374151;line-height:1.6;">Hi {{firstName}},</p>
            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#374151;line-height:1.6;">Your markets have been active this week. Here\'s what we found:</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0;background-color:#F9FAFB;border-radius:8px;">
              <tr>
                <td style="padding:16px;text-align:center;width:33%;">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;color:#1F5EFF;">12</p>
                  <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;">New Permits</p>
                </td>
                <td style="padding:16px;text-align:center;width:33%;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;color:#1F5EFF;">3</p>
                  <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;">High-Confidence Opportunities</p>
                </td>
                <td style="padding:16px;text-align:center;width:33%;">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;color:#1F5EFF;">1</p>
                  <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;">Market Surge Detected</p>
                </td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
              <tr style="background-color:#F9FAFB;">
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;color:#111827;">Project</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;color:#111827;">Location</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;color:#111827;">Confidence</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;color:#111827;">Sector</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">Apex Town Center</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">Apex, NC</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">92%</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">Mixed-Use</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">Wake Medical Office</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">Raleigh, NC</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">87%</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">Healthcare</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">Durham Tech Campus</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">Durham, NC</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">85%</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">Education</td>
              </tr>
            </table>
            <p style="margin:0;padding:12px;background-color:#FEF3C7;border-radius:6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#92400E;line-height:1.5;">
              <strong>Note:</strong> This is a sample report. Your real reports start after your trial ends.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 32px;text-align:center;">
            <a href="https://buildsignal.net/reports" style="display:inline-block;padding:14px 32px;background-color:#1F5EFF;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">View Full Report</a>
            <a href="https://buildsignal.net/reports/download" style="display:inline-block;padding:14px 32px;margin-left:12px;background-color:#FFFFFF;color:#1F5EFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;border:1px solid #1F5EFF;">Download PDF</a>
          </td>
        </tr>
        ${COMMON_FOOTER}
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const email4FeatureTips = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pro Tips from BuildSignal</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F3F4F6;">
    <tr><td style="padding:24px 0;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:600px;width:100%;margin:0 auto;background-color:#FFFFFF;border-radius:8px;overflow:hidden;border:1px solid #E5E7EB;">
        <tr>
          <td style="padding:40px 32px 0;background-color:#0B1F33;">
            <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#1F5EFF;letter-spacing:2px;text-transform:uppercase;">BUILDSIGNAL</p>
            <h1 style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#FFFFFF;line-height:1.2;">Pro tip: API access &amp; custom integrations</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 16px;">
            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#374151;line-height:1.6;">Hi {{firstName}},</p>
            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#374151;line-height:1.6;">Did you know BuildSignal has a full REST API? Pull data into your CRM, BI tools, or custom workflows. Available on Professional and Business plans. Also: set up Slack notifications for instant team alerts.</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0;">
              <tr>
                <td width="33%" style="padding:8px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F9FAFB;border-radius:8px;padding:16px;">
                    <tr><td style="text-align:center;padding-bottom:8px;">
                      <span style="display:inline-block;width:40px;height:40px;background-color:#0B1F33;border-radius:8px;line-height:40px;text-align:center;color:#1F5EFF;font-size:20px;">&#9889;</span>
                    </td></tr>
                    <tr><td style="text-align:center;">
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#111827;">API Access</p>
                      <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;line-height:1.4;">Full REST API for CRM and BI integrations.</p>
                    </td></tr>
                  </table>
                </td>
                <td width="33%" style="padding:8px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F9FAFB;border-radius:8px;padding:16px;">
                    <tr><td style="text-align:center;padding-bottom:8px;">
                      <span style="display:inline-block;width:40px;height:40px;background-color:#0B1F33;border-radius:8px;line-height:40px;text-align:center;color:#1F5EFF;font-size:20px;">&#128172;</span>
                    </td></tr>
                    <tr><td style="text-align:center;">
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#111827;">Slack Integration</p>
                      <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;line-height:1.4;">Instant team alerts in your Slack channels.</p>
                    </td></tr>
                  </table>
                </td>
                <td width="33%" style="padding:8px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F9FAFB;border-radius:8px;padding:16px;">
                    <tr><td style="text-align:center;padding-bottom:8px;">
                      <span style="display:inline-block;width:40px;height:40px;background-color:#0B1F33;border-radius:8px;line-height:40px;text-align:center;color:#1F5EFF;font-size:20px;">&#129302;</span>
                    </td></tr>
                    <tr><td style="text-align:center;">
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#111827;">Custom Models</p>
                      <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;line-height:1.4;">Tune scoring models to your deal criteria.</p>
                    </td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 32px;text-align:center;">
            <a href="https://buildsignal.net/integrations" style="display:inline-block;padding:14px 32px;background-color:#1F5EFF;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">Explore Integrations</a>
          </td>
        </tr>
        ${COMMON_FOOTER}
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const email5UpgradePrompt = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Trial is Ending Soon</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F3F4F6;">
    <tr><td style="padding:24px 0;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:600px;width:100%;margin:0 auto;background-color:#FFFFFF;border-radius:8px;overflow:hidden;border:1px solid #E5E7EB;">
        <tr>
          <td style="padding:40px 32px 0;background-color:#0B1F33;">
            <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#1F5EFF;letter-spacing:2px;text-transform:uppercase;">BUILDSIGNAL</p>
            <h1 style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#FFFFFF;line-height:1.2;">Your trial ends in 3 days — here\'s what you\'ll miss</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 16px;">
            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#374151;line-height:1.6;">Hi {{firstName}},</p>
            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#374151;line-height:1.6;">Your 14-day free trial ends soon. To keep accessing: unlimited counties, real-time alerts, API access, and custom reports. Upgrade now and save 20% on your first 3 months with code <strong style="color:#111827;">EARLY20</strong>.</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
              <tr style="background-color:#F9FAFB;">
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;color:#111827;">Feature</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;color:#111827;text-align:center;">Current (Free)</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;color:#111827;text-align:center;background-color:#1F5EFF;color:#FFFFFF;">Scout</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;color:#111827;text-align:center;">Professional</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">Counties</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;text-align:center;">3</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;text-align:center;background-color:#EFF6FF;">Unlimited</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;text-align:center;">Unlimited</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">Real-time Alerts</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;text-align:center;">Daily</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;text-align:center;background-color:#EFF6FF;">Real-time</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;text-align:center;">Real-time</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">API Access</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;text-align:center;">—</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;text-align:center;background-color:#EFF6FF;">Read-only</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;text-align:center;">Full</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;">Custom Reports</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;text-align:center;">—</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;text-align:center;background-color:#EFF6FF;">Weekly</td>
                <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#374151;border-top:1px solid #E5E7EB;text-align:center;">Weekly + On-demand</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 12px;text-align:center;">
            <a href="https://buildsignal.net/upgrade?code=EARLY20" style="display:inline-block;padding:14px 32px;background-color:#1F5EFF;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">Upgrade Now — Save 20%</a>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;text-align:center;">
            <a href="#" style="display:inline-block;padding:10px 24px;background-color:#FFFFFF;color:#6B7280;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:500;text-decoration:none;border-radius:8px;border:1px solid #E5E7EB;">Extend Trial 7 Days</a>
          </td>
        </tr>
        ${COMMON_FOOTER}
      </table>
    </td></tr>
  </table>
</body>
</html>`;

/* ------------------------------------------------------------------ */
/*  EMAIL CONFIGURATION                                                  */
/* ------------------------------------------------------------------ */

const EMAILS = [
  {
    id: "welcome",
    label: "1. Welcome",
    subject: "Welcome to BuildSignal — Your markets are waiting",
    icon: Sparkles,
    html: email1Welcome,
  },
  {
    id: "getting-started",
    label: "2. Getting Started",
    subject: "Getting started: 3 ways to win with BuildSignal",
    icon: Zap,
    html: email2GettingStarted,
  },
  {
    id: "first-report",
    label: "3. First Report",
    subject: "Your first weekly intelligence report is ready",
    icon: BarChart,
    html: email3FirstReport,
  },
  {
    id: "feature-tips",
    label: "4. Feature Tips",
    subject: "Pro tip: API access & custom integrations",
    icon: Shield,
    html: email4FeatureTips,
  },
  {
    id: "upgrade-prompt",
    label: "5. Upgrade Prompt",
    subject: "Your trial ends in 3 days — here\'s what you\'ll miss",
    icon: ChevronRight,
    html: email5UpgradePrompt,
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function EmailPreviewPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const activeEmail = EMAILS[activeIndex];

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(activeEmail.html).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [activeEmail.html]);

  const handleSendTest = useCallback(() => {
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-accent-indigo" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-ink-primary">Email Templates</h1>
            <p className="text-xs text-ink-tertiary">Onboarding sequence for new BuildSignal users</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1 border-b border-border">
        {EMAILS.map((email, index) => {
          const Icon = email.icon;
          const isActive = index === activeIndex;
          return (
            <button
              key={email.id}
              onClick={() => {
                setActiveIndex(index);
                setShowCode(false);
                setCopied(false);
                setSent(false);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-medium transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? "border-accent-indigo text-accent-indigo bg-accent-indigo/5"
                  : "border-transparent text-ink-secondary hover:text-ink-primary hover:bg-ink-wash"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {email.label}
            </button>
          );
        })}
      </div>

      {/* Subject Badge */}
      <div className="flex items-center gap-2 mb-3">
        <div className="px-3 py-1 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 text-xs font-medium text-accent-indigo flex items-center gap-1.5">
          <Mail className="w-3 h-3" />
          Subject: {activeEmail.subject}
        </div>
      </div>

      {/* Preview Pane */}
      <div className="mb-4 rounded-xl border border-border overflow-hidden bg-[var(--canvas)]">
        {/* Preview Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-ink-tertiary" />
            <span className="text-xs font-medium text-ink-secondary">Email Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-canvas text-ink-secondary hover:text-ink-primary hover:bg-surface-hover transition-all"
            >
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied" : "Copy HTML"}
            </button>
            <button
              onClick={handleSendTest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-indigo text-white hover:bg-accent-indigo-dim transition-all"
            >
              {sent ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {sent ? "Sent" : "Send Test"}
            </button>
          </div>
        </div>

        {/* Email Client Simulation */}
        <div className="p-6 flex justify-center" style={{ backgroundColor: "#F3F4F6" }}>
          <div
            className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm"
            style={{ maxWidth: 600, minHeight: 300 }}
          >
            <iframe
              title={`Email Preview: ${activeEmail.id}`}
              srcDoc={activeEmail.html}
              style={{ width: "100%", height: "100%", minHeight: 400, border: "none" }}
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>

      {/* Raw HTML Code Block */}
      <div className="rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setShowCode((v) => !v)}
          className="flex items-center justify-between w-full px-4 py-3 bg-surface hover:bg-surface-hover transition-all"
        >
          <div className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-ink-tertiary" />
            <span className="text-xs font-medium text-ink-secondary">Raw HTML</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-ink-tertiary transition-transform ${
              showCode ? "rotate-180" : ""
            }`}
          />
        </button>
        {showCode && (
          <div className="border-t border-border">
            <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed font-mono text-ink-secondary bg-canvas max-h-[400px] overflow-y-auto">
              <code>{activeEmail.html}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
