import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { storeid: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const {
      name,
      price,
      images,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
    } = body

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!name) {
      return new NextResponse("name is Required", { status: 400 })
    }
    if (!images || !images.length) {
      return new NextResponse("Images url is Required", { status: 400 })
    }
    if (!price) {
      return new NextResponse("price is Required", { status: 400 })
    }
    if (!categoryId) {
      return new NextResponse("categoryId is Required", { status: 400 })
    }

    if (!sizeId) {
      return new NextResponse("sizeId is Required", { status: 400 })
    }
    if (!colorId) {
      return new NextResponse("colorId is Required", { status: 400 })
    }
    if (!params.storeid) {
      return new NextResponse("Store Id is required", { status: 400 })
    }

    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: params.storeid,
        userId,
      },
    })

    if (!storeByUser) {
      return new NextResponse("unauthorized", { status: 403 })
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
        storeId: params.storeid,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCT_POST]", error)
    return new NextResponse("Internal error ", { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeid: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId") || undefined
    const colorId = searchParams.get("colorId") || undefined
    const sizeId = searchParams.get("sizeId") || undefined
    const isFeatured = searchParams.get("isFeatured")

    if (!params.storeid) {
      return new NextResponse("Store Id is required", { status: 400 })
    }
    console.log(isFeatured)
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeid,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        category: true,
        color: true,
        size: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.log("[GET_PRODUCTS]", error)
    return new NextResponse("Internal error ", { status: 500 })
  }
}
