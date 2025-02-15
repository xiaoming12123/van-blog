import { config } from "../utils/loadConfig";
export type SocialType =
  | "bilibili"
  | "email"
  | "github"
  | "wechat"
  | "wechat-dark";

export interface CustomPageList {
  name: string;
  path: string;
}
export interface CustomPage extends CustomPageList {
  html: string;
}
export interface SocialItem {
  updatedAt: string;
  type: SocialType;
  value: string;
  dark?: string;
}
export interface MenuItem {
  name: string;
  value: string;
}
export interface DonateItem {
  name: string;
  value: string;
  updatedAt: string;
}
export interface LinkItem {
  name: string;
  desc: string;
  logo: string;
  url: string;
  updatedAt: string;
}
export interface MetaProps {
  links: LinkItem[];
  socials: SocialItem[];
  rewards: DonateItem[];
  menus: MenuItem[];
  categories: string[];
  about: {
    updatedAt: string;
    content: string;
  };
  siteInfo: {
    author: string;
    authorDesc: string;
    authorLogo: string;
    authorLogoDark?: string;
    siteLogo: string;
    favicon: string;
    siteName: string;
    siteDesc: string;
    beianNumber: string;
    beianUrl: string;
    payAliPay: string;
    payWechat: string;
    payAliPayDark?: string;
    payWechatDark?: string;
    since: string;
    baseUrl: string;
    baiduAnalysisId?: string;
    gaAnalysisId?: string;
    siteLogoDark?: string;
    showSubMenu?: "true" | "false";
    showAdminButton?: "true" | "false";
    headerLeftContent?: "siteLogo" | "siteName";
    subMenuOffset?: number;
    showDonateInfo: "true" | "false";
    showFriends: "true" | "false";
    enableComment: "true" | "false";
    defaultTheme: "auto" | "light" | "dark";
    showDonateInAbout?: "true" | "false";
    enableCustomizing: "true" | "false";
    showDonateButton: "true" | "false";
    showCopyRight: "true" | "false";
    showRSS: "true" | "false";
  };
}
export interface PublicMetaProp {
  version: string;
  tags: string[];
  totalArticles: number;
  meta: MetaProps;
  totalWordCount: number;
  layout?: {
    css?: string;
    script?: string;
    html?: string;
  };
}
export interface PublicAllProp {
  articles: any[];
  categories: any[];
  tags: string[];
  meta: MetaProps;
  layout?: {
    customCss?: string;
    customScript?: string;
    customHtml?: string;
  };
}
export const version = process.env["VAN_BLOG_VERSION"] || "dev";

const defaultMeta: MetaProps = {
  categories: [],
  menus: [],
  links: [],
  socials: [],
  rewards: [],
  about: {
    updatedAt: new Date().toISOString(),
    content: "",
  },
  siteInfo: {
    author: "作者名字",
    authorDesc: "作者描述",
    authorLogo: "/logo.svg",
    siteLogo: "/logo.svg",
    favicon: "/logo.svg",
    siteName: "VanBlog",
    siteDesc: "Vanblog",
    beianNumber: "",
    beianUrl: "",
    payAliPay: "",
    payWechat: "",
    payAliPayDark: "",
    payWechatDark: "",
    since: "",
    enableComment: "true",
    baseUrl: "",
    showDonateInfo: "true",
    showFriends: "true",
    showAdminButton: "true",
    defaultTheme: "auto",
    showDonateInAbout: "false",
    enableCustomizing: "true",
    showCopyRight: "true",
    showDonateButton: "true",
    showRSS: "true",
  },
};

export async function getPublicMeta(): Promise<PublicMetaProp> {
  try {
    const url = `${config.baseUrl}api/public/meta`;
    const res = await fetch(url);
    const { statusCode, data } = await res.json();
    if (statusCode == 233) {
      return {
        version: version,
        totalWordCount: 0,
        tags: [],
        totalArticles: 0,
        meta: defaultMeta,
      };
    }
    return data;
  } catch (err) {
    if (process.env.isBuild == "t") {
      console.log("无法连接，采用默认值");
      // 给一个默认的吧。
      return {
        version: version,
        totalWordCount: 0,
        tags: [],
        totalArticles: 0,
        meta: defaultMeta,
      };
    } else {
      throw err;
    }
  }
}
export async function getAllCustomPages(): Promise<CustomPageList[]> {
  try {
    const url = `${config.baseUrl}api/public/customPage/all`;
    const res = await fetch(url);
    const { statusCode, data } = await res.json();
    if (statusCode == 200) {
      return data;
    } else {
      return [];
    }
  } catch (err) {
    if (process.env.isBuild == "t") {
      console.log("无法连接，采用默认值");
      // 给一个默认的吧。
      return [];
    } else {
      throw err;
    }
  }
}
export async function getCustomPageByPath(
  path: string
): Promise<CustomPage | null> {
  try {
    const url = `${config.baseUrl}api/public/customPage?path=${path}`;
    const res = await fetch(url);
    const { statusCode, data } = await res.json();
    if (statusCode == 200) {
      return data;
    } else {
      return null;
    }
  } catch (err) {
    if (process.env.isBuild == "t") {
      console.log("无法连接，采用默认值");
      // 给一个默认的吧。
      return null;
    } else {
      throw err;
    }
  }
}
