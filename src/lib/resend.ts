import {Resend} from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY || 're_Y62q2kYE_9Qj7uKfa86ySuj7o1XyZVZTd');