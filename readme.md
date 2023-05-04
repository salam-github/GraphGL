to do
loginpage

You'll use the GraphQL endpoint which is provided by the platform (https://((DOMAIN))/api/graphql-engine/v1/graphql). You'll be able to query your own data to populate your profile page.

So that you can access your data, you'll need to create a login page.

Your profile must display three pieces of information which you may choose. For example:

Basic user identification
XP amount
grades
audits
skills

You will have to create a profile UI where you can see your own school information. This information/data is present on the GraphQL endpoint, where you will have to query it.

it must have a statistic section where you can generate graphs to see more about your journey and achievements on the school. This graphs must be done using SVG. You need to do at least two different statistic graphs for the data given.

Login Page
You'll need a JWT to access the GraphQL API. A JWT can be obtained from the signin endpoint (https://((DOMAIN))/api/auth/signin).

You may make a POST request to the signin endpoint, and supply your credentials using Basic authentication, with base64 encoding.

Your login page must function with both:

username:password
email:password
If the credentials are invalid, an appropriate error message must be displayed.

You must provide a method to log out.

When making GraphQL queries, you'll supply the JWT using Bearer authentication. It will only allow access to the data belonging to the authenticated user.

Here are a selection of interesting tables and columns which are exposed via GraphQL:

user table:

This table will have information about the user.

id	login
1	person1
transaction table:

This table will give you access to XP and through user table you can get to the audits ratio as well.

id	type	amount	objectId	userId	createdAt	path
1	xp	234	42	1	2021-07-26T13:04:02.301092+00:00	/madere/div-01/graphql
2	xp	1700	2	1	2021-07-26T13:04:02.301092+00:00	/madere/div-01/graphql
3	xp	175	64	1	2021-07-26T13:04:02.301092+00:00	/madere/div-01/graphql
progress table:

id	userId	objectId	grade	createdAt	updatedAt	path
1	1	3001	1	2021-07-26T13:04:02.301092+00:00	2021-07-26T13:04:02.301092+00:00	/madere/piscine-go/quest-01
2	1	198	0	2021-07-26T13:04:02.301092+00:00	2021-07-26T13:04:02.301092+00:00	/madere/piscine-go/quest-01
3	1	177	1	2021-07-26T13:04:02.301092+00:00	2021-07-26T13:04:02.301092+00:00	/madere/piscine-go/quest-01
result table:

Both progress and result table will give you the student progression.

id	objectId	userId	grade	type	createdAt	updatedAt	path
1	3	1	0		2021-07-26T13:04:02.301092+00:00	2021-07-26T13:04:02.301092+00:00	/madere/div-01/graphql
2	23	1	0		2021-07-26T13:04:02.301092+00:00	2021-07-26T13:04:02.301092+00:00	/madere/div-01/graphql
3	41	1	1		2021-07-26T13:04:02.301092+00:00	2021-07-26T13:04:02.301092+00:00	/madere/div-01/graphql
object table:

This table will give you information about all objects (exercises/projects).

id	name	type	attrs
1	0	exercise	{}
2	0	project	{}
3	1	exercise	{}