import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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
    
    const allUsersWithPosts = await prisma.user.findMany({
        include: {
            posts: true,
        },
    })
    console.dir(allUsersWithPosts, { depth: null })

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
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()

  })