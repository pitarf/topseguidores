import { NextResponse } from "next/server";
import { getPlans } from "@/services/plans";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");
  const type = searchParams.get("type");
  const packageType = searchParams.get("packageType");

  const plans = await getPlans({ 
    platform: platform || undefined, 
    type: type || undefined, 
    packageType: packageType || undefined 
  });
  return NextResponse.json(plans);
}
