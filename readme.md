
# Grit:Lab GraphQL
-----------------
## TODO
- [x] get all necessary data from graphql(xp, audits, grades, skills, etc)
- [x] separete quaries into another file that we can import
- [x] Draw graphs
- [x] use some CSS magic to make it look good
- [x] host it on heroku/github pages/netlify
- [x] ?????
- [x] profit
- [x] and look some some vurnerabilities
-----------------

-----------------
## How to run 
here is a link to the aaapp: (`https://(((DOMAIN))).herokuapp.com/`)


-----------------

## instructions -->

You'll use the GraphQL endpoint which is provided by the platform (`https://((DOMAIN))/api/graphql-engine/v1/graphql`). You'll be able to query your own data to populate your profile page.

So that you can access your data, you'll need to create a login page.

Your profile must display three pieces of information which you may choose. For example:

- Basic user identification
- XP amount
- grades
- audits
- skills

You will have to create a profile UI where you can see your own school information. This information/data is present on the GraphQL endpoint, where you will have to query it.

it must have a statistic section where you can generate graphs to see more about your journey and achievements on the school. This graphs must be done using **SVG**. You need to do at least **two** different statistic graphs for the data given.

Login Page
You'll need a JWT to access the GraphQL API. A JWT can be obtained from the signin endpoint (`https://((DOMAIN))/api/auth/signin`).

You may make a POST request to the signin endpoint, and supply your credentials using Basic authentication, with base64 encoding.

Your login page must function with both:

- username:password
- email:password
If the credentials are invalid, an appropriate error message must be displayed.

You must provide a method to log out.

When making GraphQL queries, you'll supply the **JWT** using **Bearer** authentication. It will only allow access to the data belonging to the authenticated user.

     GetStats--->   id
        login
        transactions (
            order_by:{createdAt:desc}
            offset:${offset}
        )
        {
            amount
            type
            path
            object {
                type
                name
            }
        }


skill_css
skill_front-end
skill_html
skill_js
skill_go
skill_tcp
skill_unix
skill_back-end
skill_docker
skill_sql
skill_sys-admin
skill_game
skill_algo