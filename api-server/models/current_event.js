/**
 * @swagger
 *
 * definitions:
 *  CurrentEvent:
 *    type: object
 *    properties:
 *       id:
 *        type: string
 *       title:
 *        type: string
 *       slug:
 *        type: string
 *       multi_day:
 *        type: boolean
 *        deprecated: true
 *       date_times:
 *        type: array
 *        items:
 *          type: object
 *       image:
 *        type: string
 *       social_image:
 *        type: string
 *       venue_id:
 *        type: string
 *       admission_fee:
 *        type: string
 *       address:
 *        type: string
 *       organizer_contact:
 *        type: string
 *       map_link:
 *        type: string
 *       brief_description:
 *        type: string
 *       description:
 *        string: string
 *       links:
 *        type: array
 *        items:
 *          type: string
 *       website_link:
 *        type: string
 *       ticket_link:
 *        type: string
 *       fb_event_link:
 *        type: string
 *       eventbrite_link:
 *        type: string
 *       bitly_link:
 *        type: string
 *       tags:
 *        type: array
 *        items:
 *          type: string
 *       verified:
 *        type: boolean
 *       reviewed_by_org:
 *        type: string
 *       first_day_start_time:
 *        type: string
 *        format: date-time
 *       last_day_start_time:
 *        type: string
 *        format: date-time
 *       venue:
 *        type: object
 */

const { getEventBase } = require('./eventBase')

module.exports = (sequelize, DataType) => {
  const current_event = sequelize.define('current_event', {
    ...getEventBase(DataType),
    first_day_start_time: DataType.DATE,
    last_day_end_time: DataType.DATE
  }, {});
  return current_event;
};
