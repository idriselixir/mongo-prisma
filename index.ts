import { PrismaClient } from '@prisma/client'
//This creates a new instance of the PrismaClient class and assigns it to the variable prisma.
// This instance establishes the connection to your database.
const prisma = new PrismaClient()
//This defines an asynchronous function main. Asynchronous functions (marked with async) allow you to use the await keyword
// to manage operations that take time (like database queries) without blocking the execution thread.
/**
 * Executes the main function.
 * 
 * This function creates a user and a related post using Prisma ORM.
 * It then retrieves all users with their associated posts from the database.
 * Next, it updates a specific post by adding multiple comments.
 * Finally, it retrieves all posts with their associated comments, deletes the comments for a specific post,
 * and deletes the post itself.
 */
async function main() {
    //Create a User and Related Post
    await prisma.user.create({
        data: {
          name: 'Idris NNN',
          email: 'idrisnnn@gmail.com',
          posts: {
            create: {
              title: 'My first post',
              body: 'Lots of really interesting stuff',
              slug: 'my-first-post',
            },
          },
        },
      })
      //Database Operation: A 'findMany' (similar to a 'select') query.
      //prisma.user.findMany(...): Retrieves multiple user records from the database.
      //include: { posts: true }: This part of the code ensures that for each user record retrieved,
      // the related posts are also included in the fetched data.
    const allUsersWithPosts = await prisma.user.findMany({
        include: {
            posts: true,
        },
    })
    console.dir(allUsersWithPosts, { depth: null })
// Database Operation: An 'update' operation.
// prisma.post.update(...): Targets the post model.
// where: Identifies the specific post to update using its unique 'slug'.
// createMany: Creates multiple comment records associated with the post.
    await prisma.post.update({
        where: {
          slug: 'my-first-post',
        },
        data: {
          comments: {
            createMany: {
              data: [
                { comment: 'Great post!' },
                { comment: "Can't wait to read more!" },
              ],
            },
          },
        },
      })
      const posts = await prisma.post.findMany({
        include: {
          comments: true,
        },
      })
    
    console.dir(posts, { depth: Infinity })
    //delete comments and post
    await prisma.comment.deleteMany({
where: {
    post:{
        slug: "my-first-post",
    }
    ,}
    
    })
    await prisma.post.delete({  where: { slug: 'my-first-post' },})
    console.log('post deleeted successfully!')
}



main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()

  })

