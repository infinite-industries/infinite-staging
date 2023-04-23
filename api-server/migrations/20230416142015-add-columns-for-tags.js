'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'datetime_venue',
        'category',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'events',
        'category',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'events',
        'condition',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'events',
        'mode',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.sequelize.query(`
      /* move category labels from events.tags to events.category */

        UPDATE events
        SET category = replace(tag, 'category:', '')
        FROM (SELECT id, unnest(tags) AS tag FROM events) AS unnested
        WHERE tag LIKE 'category:%' AND events.id = unnested.id;

        WITH category_removed AS(
          SELECT id, ARRAY_AGG(tag) as tags FROM (SELECT id, UNNEST(tags) AS tag FROM events) unnested
          WHERE tag NOT LIKE 'category:%'
          GROUP BY id
        )
        UPDATE events
        SET tags = category_removed.tags
        FROM category_removed
        WHERE events.id = category_removed.id;

        /* move condition labels from events.tags to events.condition */

        UPDATE events
        SET condition = replace(tag, 'condition:', '')
        FROM (SELECT id, unnest(tags) AS tag FROM events) AS unnested
        WHERE tag LIKE 'condition:%' AND events.id = unnested.id;

        WITH condition_removed AS(
          SELECT id, ARRAY_AGG(tag) as tags FROM (SELECT id, UNNEST(tags) AS tag FROM events) unnested
          WHERE tag NOT LIKE 'condition:%'
          GROUP BY id
        )
        UPDATE events
        SET tags = condition_removed.tags
        FROM condition_removed
        WHERE events.id = condition_removed.id;

        /* move mode labels from events.tags to events.mode */

        UPDATE events
        SET mode = replace(tag, 'mode:', '')
        FROM (SELECT id, unnest(tags) AS tag FROM events) AS unnested
        WHERE tag LIKE 'mode:%' AND events.id = unnested.id;

        WITH mode_removed AS(
          SELECT id, ARRAY_AGG(tag) as tags FROM (SELECT id, UNNEST(tags) AS tag FROM events) unnested
          WHERE tag NOT LIKE 'mode:%'
          GROUP BY id
        )
        UPDATE events
        SET tags = mode_removed.tags
        FROM mode_removed
        WHERE events.id = mode_removed.id;
    `)
    ]
  },

  async down(queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('datetime_venue', 'category'),
      queryInterface.sequelize.query(`
        UPDATE events
        SET tags = tags || CONCAT('category:', category)::VARCHAR(255)
        WHERE category IS NOT NULL;

        UPDATE events
        SET tags = tags || CONCAT('condition:', condition)::VARCHAR(255)
        WHERE condition IS NOT NULL;

        UPDATE events
        SET tags = tags || CONCAT('mode:', mode)::VARCHAR(255)
        WHERE mode IS NOT NULL;
        `),
      queryInterface.removeColumn('events', 'category'),
      queryInterface.removeColumn('events', 'condition'),
      queryInterface.removeColumn('events', 'mode')
    ]
  }
};
