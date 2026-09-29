-- Give existing in-stock products an initial stock level (the new column defaulted to 0)
UPDATE "products" SET "stock" = 25 WHERE "availability" = 'in-stock' AND "stock" = 0;
