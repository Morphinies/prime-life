import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, Link, useLocation, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, UNSAFE_withComponentProps, Outlet, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import { useEffect, useState, forwardRef } from "react";
import { theme, ConfigProvider, App, Typography, Layout as Layout$1, Flex, Menu, Avatar, Input, Badge, Button, Result, Checkbox, Tag, Progress as Progress$1, Card, Row, Col } from "antd";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import ruRU from "antd/locale/ru_RU.js";
import { useSelector, useDispatch, Provider } from "react-redux";
import * as Icons from "@ant-design/icons";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }
  return "light";
};
const initialState = {
  mode: "light",
  initialized: false
};
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    initTheme: (state) => {
      if (!state.initialized && typeof window !== "undefined") {
        state.mode = getInitialTheme();
        state.initialized = true;
      }
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", state.mode);
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
      }
    }
  }
});
const { toggleTheme, initTheme, setTheme } = themeSlice.actions;
const themeReducer = themeSlice.reducer;
const store = configureStore({
  reducer: {
    theme: themeReducer
  }
});
const useAppDispatch = () => useDispatch();
const useAppSelector = useSelector;
const selectIsDarkTheme = (state) => state.theme.mode === "dark";
const { useToken } = theme;
const useThemeToken = () => {
  const isDark = useAppSelector(selectIsDarkTheme);
  const token = useToken();
  return { ...token, isDark };
};
const ThemeTokenObserver = ({ onTokenChange }) => {
  const { token } = useThemeToken();
  const isDarkTheme = useAppSelector(selectIsDarkTheme);
  useEffect(() => {
    onTokenChange?.(token);
  }, [token, isDarkTheme, onTokenChange]);
  return null;
};
const lightTheme = {
  token: {
    // colorPrimary: '#1890ff',
    // colorSuccess: '#52c41a',
    // colorWarning: '#faad14',
    // colorError: '#f5222d',
    // colorInfo: '#1890ff',
    // colorBgBase: '#ffffff',
    // colorTextBase: '#000000',
  }
};
const darkTheme = {
  token: {
    // colorPrimary: '#177ddc',
    // colorSuccess: '#49aa19',
    // colorWarning: '#d89614',
    // colorError: '#d32029',
    // colorInfo: '#177ddc',
    // colorBgBase: '#141414',
    // colorTextBase: '#ffffff',
  }
};
const AntdProvider = ({ children }) => {
  const [token, setToken] = useState(void 0);
  const dispatch = useAppDispatch();
  const isDarkTheme = useAppSelector(selectIsDarkTheme);
  const customToken = isDarkTheme ? darkTheme.token : lightTheme.token;
  useEffect(() => {
    dispatch(initTheme());
  }, []);
  const themeConfig = {
    algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      ...customToken
    },
    components: {
      Button: {
        borderRadius: 4,
        controlHeight: 32
      },
      Input: {
        borderRadius: 4,
        controlHeight: 32
      },
      Card: {
        borderRadiusLG: 8
      },
      Layout: {
        triggerBg: token?.colorBgContainer,
        triggerColor: token?.colorText
      },
      Typography: {
        titleMarginTop: 0,
        titleMarginBottom: 0
      }
    }
  };
  return (
    // <StyleProvider hashPriority="high">
    /* @__PURE__ */ jsx(ConfigProvider, { theme: themeConfig, locale: ruRU, componentSize: "middle", children: /* @__PURE__ */ jsxs(App, { style: { display: "flex", flexDirection: "column", height: "100%" }, children: [
      /* @__PURE__ */ jsx(ThemeTokenObserver, { onTokenChange: setToken }),
      children
    ] }) })
  );
};
const DESTRUCTION_CLASS = "_destruction";
const Preloader = () => {
  const [isAnimDestruction, setIsAnimDestruction] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsAnimDestruction(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 350);
      }, 500);
    }
  }, [isLoading]);
  if (!isLoading) return null;
  return /* @__PURE__ */ jsx("div", { className: `preloader ${isAnimDestruction ? DESTRUCTION_CLASS : ""}`, children: /* @__PURE__ */ jsx("div", { className: "preloader-icon" }) });
};
const AppProviders = ({ children }) => {
  return /* @__PURE__ */ jsxs(Provider, { store, children: [
    /* @__PURE__ */ jsx(Preloader, {}),
    /* @__PURE__ */ jsx(AntdProvider, { children })
  ] });
};
const Icon = ({ name, ...restProps }) => {
  const IconComponent = Icons[name];
  if (!IconComponent) {
    console.warn(`Иконка "${name}" не найдена`);
    return null;
  }
  return /* @__PURE__ */ jsx(IconComponent, { ...restProps });
};
function prepareMenuItems(items) {
  return items.map(({ href, icon, key, label }) => ({
    key,
    href,
    icon: /* @__PURE__ */ jsx(Icon, { name: icon }),
    label: /* @__PURE__ */ jsx(Link, { to: href, children: label })
  }));
}
const common = {
  menuItems: prepareMenuItems([
    {
      key: "1",
      icon: "LineChartOutlined",
      href: "/dashboard",
      label: "Дашборд"
    },
    {
      key: "2",
      icon: "CheckSquareOutlined",
      href: "/tasks",
      label: "Задачи"
    },
    {
      key: "3",
      icon: "FolderOpenOutlined",
      href: "/projects",
      label: "Проекты"
    },
    {
      key: "4",
      icon: "CreditCardOutlined",
      href: "/finance",
      label: "Финансы"
    },
    {
      key: "5",
      icon: "SmileOutlined",
      href: "/habits",
      label: "Привычки"
    },
    {
      key: "6",
      icon: "SettingOutlined",
      href: "/settings",
      label: "Настройки"
    }
  ])
};
const { Title: Title$7 } = Typography;
const Sidebar = ({ collapsed, setCollapsed }) => {
  const { menuItems } = common;
  const { token } = useThemeToken();
  const { pathname } = useLocation();
  const [selectedMenuKeys, setSelectedMenuKeys] = useState([]);
  useEffect(() => {
    const activeMenuKey = menuItems.find((item) => item.href === pathname)?.key;
    setSelectedMenuKeys(activeMenuKey ? [activeMenuKey] : []);
  }, [pathname]);
  return /* @__PURE__ */ jsx(
    Layout$1.Sider,
    {
      collapsible: true,
      collapsed,
      onCollapse: (value) => setCollapsed(value),
      style: {
        background: token.colorBgContainer
      },
      children: /* @__PURE__ */ jsxs(Flex, { vertical: true, style: { height: "100%" }, children: [
        /* @__PURE__ */ jsx(
          Menu,
          {
            mode: "inline",
            items: menuItems,
            selectedKeys: selectedMenuKeys,
            style: {
              flex: 1,
              border: "none"
            }
          }
        ),
        /* @__PURE__ */ jsx(Link, { to: "/profile", className: "ant-menu-item", children: /* @__PURE__ */ jsxs(
          Flex,
          {
            gap: "small",
            style: {
              marginTop: "auto",
              alignItems: "center",
              padding: token.paddingXS,
              paddingInline: token.paddingLG
            },
            children: [
              /* @__PURE__ */ jsx(Avatar, { style: { flexShrink: 0 }, icon: /* @__PURE__ */ jsx(Icon, { name: "UserOutlined" }) }),
              /* @__PURE__ */ jsx(
                Title$7,
                {
                  style: {
                    margin: 0,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    opacity: collapsed ? 0 : 1,
                    transition: `opacity ${token.motionDurationMid} ${token.motionEaseInOut}`
                  },
                  level: 5,
                  children: "Profile"
                }
              )
            ]
          }
        ) })
      ] })
    }
  );
};
const SvgLogoDark = ({
  title,
  titleId,
  ...props
}, ref) => /* @__PURE__ */ React.createElement("svg", { width: "800px", height: "800px", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref, "aria-labelledby": titleId, ...props }, title ? /* @__PURE__ */ React.createElement("title", { id: titleId }, title) : null, /* @__PURE__ */ React.createElement("path", { d: "M22.0003 5.71V15.29C22.0003 18.05 19.7603 20.29 17.0003 20.29H7.00031C6.54031 20.29 6.10031 20.23 5.67031 20.11C5.05031 19.94 4.85031 19.15 5.31031 18.69L15.9403 8.06C16.1603 7.84 16.4903 7.79 16.8003 7.85C17.1203 7.91 17.4703 7.82 17.7203 7.58L20.2903 5C21.2303 4.06 22.0003 4.37 22.0003 5.71Z", fill: "#000000" }), /* @__PURE__ */ React.createElement("path", { opacity: 0.7, d: "M14.64 7.36002L4.17 17.83C3.69 18.31 2.89 18.19 2.57 17.59C2.2 16.91 2 16.12 2 15.29V5.71002C2 4.37002 2.77 4.06002 3.71 5.00002L6.29 7.59002C6.68 7.97002 7.32 7.97002 7.71 7.59002L11.29 4.00002C11.68 3.61002 12.32 3.61002 12.71 4.00002L14.65 5.94002C15.03 6.33002 15.03 6.97002 14.64 7.36002Z", fill: "#333333" }));
const ForwardRef$1 = forwardRef(SvgLogoDark);
const SvgLogoLight = ({
  title,
  titleId,
  ...props
}, ref) => /* @__PURE__ */ React.createElement("svg", { width: "800px", height: "800px", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref, "aria-labelledby": titleId, ...props }, title ? /* @__PURE__ */ React.createElement("title", { id: titleId }, title) : null, /* @__PURE__ */ React.createElement("path", { d: "M22.0003 5.71V15.29C22.0003 18.05 19.7603 20.29 17.0003 20.29H7.00031C6.54031 20.29 6.10031 20.23 5.67031 20.11C5.05031 19.94 4.85031 19.15 5.31031 18.69L15.9403 8.06C16.1603 7.84 16.4903 7.79 16.8003 7.85C17.1203 7.91 17.4703 7.82 17.7203 7.58L20.2903 5C21.2303 4.06 22.0003 4.37 22.0003 5.71Z", fill: "#ffffff" }), /* @__PURE__ */ React.createElement("path", { opacity: 0.7, d: "M14.64 7.36002L4.17 17.83C3.69 18.31 2.89 18.19 2.57 17.59C2.2 16.91 2 16.12 2 15.29V5.71002C2 4.37002 2.77 4.06002 3.71 5.00002L6.29 7.59002C6.68 7.97002 7.32 7.97002 7.71 7.59002L11.29 4.00002C11.68 3.61002 12.32 3.61002 12.71 4.00002L14.65 5.94002C15.03 6.33002 15.03 6.97002 14.64 7.36002Z", fill: "#cccccc" }));
const ForwardRef = forwardRef(SvgLogoLight);
const Logo = ({ collapsed }) => {
  const { token, isDark } = useThemeToken();
  return /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsxs(
    Flex,
    {
      gap: "small",
      align: "center",
      justify: "flex-start",
      style: {
        width: collapsed ? 80 : 200,
        paddingLeft: token.paddingLG,
        transition: `width ${token.motionDurationMid} ${token.motionEaseInOut}`
      },
      children: [
        isDark ? /* @__PURE__ */ jsx(
          ForwardRef,
          {
            style: {
              width: "2rem",
              height: "2rem",
              flexShrink: 0
            }
          }
        ) : /* @__PURE__ */ jsx(
          ForwardRef$1,
          {
            style: {
              width: "2rem",
              height: "2rem",
              flexShrink: 0
            }
          }
        ),
        /* @__PURE__ */ jsx(
          Typography.Text,
          {
            strong: true,
            style: {
              fontSize: 16,
              whiteSpace: "nowrap",
              opacity: collapsed ? 0 : 1,
              transition: `opacity ${token.motionDurationMid} ${token.motionEaseInOut}`
            },
            children: "PrimeLife"
          }
        )
      ]
    }
  ) });
};
const Header = ({ collapsed }) => {
  const dispatch = useAppDispatch();
  const isDarkTheme = useAppSelector(selectIsDarkTheme);
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  return /* @__PURE__ */ jsxs(
    Layout$1.Header,
    {
      style: { padding: 0, background: colorBgContainer, display: "flex", alignItems: "center" },
      children: [
        /* @__PURE__ */ jsx(Logo, { collapsed }),
        /* @__PURE__ */ jsxs(Flex, { flex: 1, justify: "space-between", style: { padding: "0 16px" }, children: [
          /* @__PURE__ */ jsx(Input.Search, { placeholder: "Поиск...", style: { width: 300 } }),
          /* @__PURE__ */ jsxs(Flex, { gap: "medium", children: [
            /* @__PURE__ */ jsx(Badge, { count: 1, size: "small", children: /* @__PURE__ */ jsx(
              Button,
              {
                icon: /* @__PURE__ */ jsx(
                  Icon,
                  {
                    name: "MessageOutlined",
                    style: {
                      fontSize: 18
                    }
                  }
                ),
                type: "text"
              }
            ) }),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: () => dispatch(toggleTheme()),
                icon: /* @__PURE__ */ jsx(
                  Icon,
                  {
                    name: isDarkTheme ? "SunOutlined" : "MoonOutlined",
                    style: {
                      fontSize: 18
                    }
                  }
                ),
                type: "text"
              }
            )
          ] })
        ] })
      ]
    }
  );
};
const RootLayout = ({ children }) => {
  const { token } = useThemeToken();
  const [collapsed, setCollapsed] = useState(false);
  return /* @__PURE__ */ jsxs(Layout$1, { style: { height: "100%", display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ jsx(Header, { collapsed }),
    /* @__PURE__ */ jsxs(Flex, { flex: 1, children: [
      /* @__PURE__ */ jsx(Sidebar, { collapsed, setCollapsed }),
      /* @__PURE__ */ jsx(Layout$1, { children: /* @__PURE__ */ jsx(
        Layout$1.Content,
        {
          style: {
            minHeight: 280,
            margin: token.marginMD
          },
          children
        }
      ) })
    ] })
  ] });
};
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "ru",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "UTF-8"
      }), /* @__PURE__ */ jsx("link", {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx(AppProviders, {
        children: /* @__PURE__ */ jsx(RootLayout, {
          children
        })
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let details = "An unexpected error occurred.";
  if (isRouteErrorResponse(error)) {
    error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsx(Result, {
    title: "404",
    status: "404",
    subTitle: "Извините, страница, которую вы ищете, не существует.",
    extra: /* @__PURE__ */ jsx(Link, {
      to: "/",
      children: /* @__PURE__ */ jsx(Button, {
        type: "primary",
        children: "Вернуться на главную"
      })
    })
  });
});
const root = UNSAFE_withComponentProps(function Root() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
function meta({}) {
  return [{
    title: "Home"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Fragment, {
    children: "Home Page"
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const Substrate = ({
  full,
  padding,
  children,
  fullHeight,
  style = {},
  ...rest
}) => {
  const { token } = useThemeToken();
  return /* @__PURE__ */ jsx(
    Flex,
    {
      vertical: true,
      style: {
        borderRadius: token.borderRadiusLG,
        background: token.colorBgContainer,
        width: full ? "auto" : "fit-content",
        height: fullHeight ? "100%" : void 0,
        padding: token[`padding${padding || "MD"}`],
        ...style
      },
      ...rest,
      children
    }
  );
};
const COLORS = {
  red: "red",
  volcano: "volcano",
  orange: "orange",
  gold: "gold",
  yellow: "yellow",
  lime: "lime",
  green: "green",
  cyan: "cyan",
  blue: "blue",
  geekblue: "geekblue",
  purple: "purple",
  magenta: "magenta"
};
const { Title: Title$6, Text: Text$5 } = Typography;
const PRIORITY_MAP = {
  high: { color: "orange", content: "Высокий" },
  middle: { color: "lime", content: "Средний" },
  low: { color: "cyan", content: "Низкий" }
};
const Tasks = ({ title, list = [] }) => {
  const { token } = useThemeToken();
  return /* @__PURE__ */ jsxs(Substrate, { style: { minWidth: 300, gap: token.sizeLG }, full: true, fullHeight: true, children: [
    /* @__PURE__ */ jsx(Title$6, { level: 4, children: title }),
    /* @__PURE__ */ jsx(Flex, { vertical: true, gap: "medium", children: list.map(({ title: title2, deadline, priority, section, ...rest }, index2) => /* @__PURE__ */ jsx(
      Checkbox,
      {
        styles: {
          label: { width: "100%" },
          icon: { alignSelf: "flex-start", marginTop: "0.3em" }
        },
        ...rest,
        children: /* @__PURE__ */ jsxs(Flex, { align: "flex-start", justify: "space-between", children: [
          /* @__PURE__ */ jsxs(Flex, { vertical: true, align: "flex-start", children: [
            /* @__PURE__ */ jsx(Title$6, { level: 5, children: title2 }),
            /* @__PURE__ */ jsxs(Flex, { gap: "medium", children: [
              /* @__PURE__ */ jsx(Tag, { children: section }),
              /* @__PURE__ */ jsx(Text$5, { children: deadline, type: "secondary" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            Tag,
            {
              children: PRIORITY_MAP[priority].content,
              color: COLORS[PRIORITY_MAP[priority].color]
            }
          )
        ] })
      },
      index2
    )) })
  ] });
};
const { Title: Title$5, Text: Text$4 } = Typography;
const Habits = ({ title, list = [] }) => {
  const { token } = useThemeToken();
  return /* @__PURE__ */ jsxs(Substrate, { style: { minWidth: 300, gap: token.sizeLG }, full: true, fullHeight: true, children: [
    /* @__PURE__ */ jsx(Title$5, { level: 4, children: title }),
    /* @__PURE__ */ jsx(Flex, { vertical: true, gap: "medium", children: list.map(({ title: title2, icon, done }, index2) => /* @__PURE__ */ jsx(
      Checkbox,
      {
        styles: {
          root: { display: "flex", flexDirection: "row-reverse" },
          label: { width: "100%", paddingLeft: 0 },
          icon: { alignSelf: "flex-start", marginTop: "0.3em" }
        },
        defaultChecked: done,
        children: /* @__PURE__ */ jsx(Flex, { align: "flex-start", justify: "space-between", children: /* @__PURE__ */ jsxs(Flex, { align: "center", gap: "small", children: [
          /* @__PURE__ */ jsx(Icon, { name: icon }),
          /* @__PURE__ */ jsx(Title$5, { level: 5, children: title2 })
        ] }) })
      },
      index2
    )) })
  ] });
};
const { Title: Title$4, Text: Text$3 } = Typography;
const Finance = ({ title, cards = [], list = [] }) => {
  const { token } = useThemeToken();
  return /* @__PURE__ */ jsxs(Substrate, { style: { minWidth: 300, gap: token.sizeLG }, full: true, fullHeight: true, children: [
    /* @__PURE__ */ jsx(Title$4, { level: 4, children: title }),
    /* @__PURE__ */ jsxs(Flex, { vertical: true, gap: "medium", children: [
      /* @__PURE__ */ jsx(Flex, { gap: "medium", children: cards.map(({ label, title: title2, desc, color = "blue" }, index2) => /* @__PURE__ */ jsxs(Tag, { style: { flex: 1, padding: token.sizeSM }, color: COLORS[color], children: [
        /* @__PURE__ */ jsx(Text$3, { children: label }),
        /* @__PURE__ */ jsx(Title$4, { level: 3, children: title2 }),
        /* @__PURE__ */ jsx(Text$3, { children: desc })
      ] }, index2)) }),
      /* @__PURE__ */ jsx(Flex, { vertical: true, gap: "small", children: list.map(({ title: title2, value, color = "blue" }, index2) => /* @__PURE__ */ jsxs(Flex, { gap: "small", children: [
        /* @__PURE__ */ jsx(
          Badge,
          {
            status: "default",
            styles: {
              root: {
                display: "flex",
                alignItems: "center"
              },
              indicator: {
                width: "0.75rem",
                height: "0.75rem",
                background: COLORS[color]
              }
            }
          }
        ),
        /* @__PURE__ */ jsx(Text$3, { children: title2 }),
        /* @__PURE__ */ jsx(
          Text$3,
          {
            strong: true,
            children: value,
            style: {
              marginLeft: "auto"
            }
          }
        )
      ] }, index2)) })
    ] })
  ] });
};
const { Title: Title$3, Text: Text$2 } = Typography;
const Progress = ({ title, percent, desc, descRight }) => {
  const { token } = useThemeToken();
  return /* @__PURE__ */ jsxs(Substrate, { style: { minWidth: 300, gap: token.size }, justify: "space-between", full: true, fullHeight: true, children: [
    /* @__PURE__ */ jsx(Title$3, { level: 4, children: title }),
    /* @__PURE__ */ jsx(
      Progress$1,
      {
        type: "circle",
        percent,
        style: {
          alignSelf: "center"
        }
      }
    ),
    /* @__PURE__ */ jsxs(Flex, { justify: "space-between", children: [
      /* @__PURE__ */ jsx(Text$2, { children: desc }),
      /* @__PURE__ */ jsx(Text$2, { type: "success", children: descRight })
    ] })
  ] });
};
const { Title: Title$2, Text: Text$1 } = Typography;
const Projects = ({ title, list = [] }) => {
  const { token } = useThemeToken();
  return /* @__PURE__ */ jsxs(Substrate, { style: { minWidth: 300, gap: token.size }, full: true, fullHeight: true, children: [
    /* @__PURE__ */ jsx(Title$2, { level: 4, children: title }),
    /* @__PURE__ */ jsx(Flex, { vertical: true, gap: "medium", children: list.map(({ id, color = "blue", title: title2, text, progress, tag }) => /* @__PURE__ */ jsxs(
      Card,
      {
        size: "small",
        styles: {
          body: {
            gap: token.sizeMD,
            display: "flex",
            flexDirection: "column"
          }
        },
        children: [
          /* @__PURE__ */ jsxs(Flex, { justify: "space-between", align: "flex-start", children: [
            /* @__PURE__ */ jsxs(Flex, { vertical: true, children: [
              /* @__PURE__ */ jsx(Title$2, { level: 5, children: title2 }),
              /* @__PURE__ */ jsx(Text$1, { type: "secondary", children: Array.isArray(text) ? text.join(" • ") : text })
            ] }),
            /* @__PURE__ */ jsx(Tag, { color: COLORS[color], ...tag })
          ] }),
          /* @__PURE__ */ jsx(Progress$1, { styles: { track: { background: COLORS[color] } }, ...progress })
        ]
      },
      id
    )) })
  ] });
};
const { Title: Title$1, Text } = Typography;
const Statistics = ({ title, list = [] }) => {
  const { token } = useThemeToken();
  return /* @__PURE__ */ jsxs(Substrate, { style: { minWidth: 300, gap: token.size }, full: true, fullHeight: true, children: [
    /* @__PURE__ */ jsx(Title$1, { level: 4, children: title }),
    /* @__PURE__ */ jsx(Flex, { vertical: true, gap: "medium", children: list.map(({ id, color, label, ...rest }, index2) => /* @__PURE__ */ jsxs(Flex, { vertical: true, children: [
      label && /* @__PURE__ */ jsx(Text, { children: label }),
      /* @__PURE__ */ jsx(
        Progress$1,
        {
          styles: { track: { background: color ? token[color] : void 0 } },
          ...rest
        }
      )
    ] }, index2)) })
  ] });
};
const { Title } = Typography;
const FastActions = ({ title, list }) => {
  return /* @__PURE__ */ jsxs(Substrate, { gap: "middle", full: true, fullHeight: true, children: [
    /* @__PURE__ */ jsx(Title, { level: 4, children: title }),
    /* @__PURE__ */ jsx(Flex, { gap: "medium", vertical: true, children: list?.map((item, index2) => /* @__PURE__ */ jsx(Button, { variant: "solid", size: "large", ...item }, index2)) })
  ] });
};
const content$1 = {
  progress: {
    percent: 75,
    title: "Прогресс дня",
    desc: "6 из 8 задач",
    descRight: "+2 сегодня"
  },
  statistics: {
    title: "Статистика",
    list: [
      {
        id: "1",
        percent: 100,
        status: "success",
        label: "Спринт задач | неделя"
      },
      {
        id: "2",
        percent: 60,
        color: COLORS.purple,
        label: "Спринт задач | месяц"
      },
      {
        id: "3",
        percent: 40,
        color: COLORS.volcano,
        label: "Спринт привычек | месяц"
      },
      {
        id: "4",
        percent: 30,
        color: COLORS.geekblue,
        label: "Активные задачи"
      },
      {
        id: "5",
        percent: 40,
        color: COLORS.magenta,
        label: "Финаносовая цель | Месяц"
      },
      {
        id: "5",
        percent: 40,
        color: COLORS.volcano,
        label: "Финаносовая цель | Год"
      }
    ]
  },
  fastActions: {
    title: "Быстрые действия",
    list: [
      { children: "Новая задача", color: "primary" },
      { children: "Создать проект" },
      { children: "Добавить Доход" },
      { children: "Добавить расход" }
    ]
  },
  tasks: {
    title: "Ближайшие задачи",
    list: [
      {
        title: "Завершить документацию",
        section: "Работа",
        deadline: "Сегодня, 18:00",
        priority: "high"
      },
      {
        title: "Завершить документацию",
        section: "Работа",
        deadline: "Сегодня, 18:00",
        priority: "middle"
      },
      {
        title: "Завершить документацию",
        section: "Работа",
        deadline: "Сегодня, 18:00",
        priority: "low"
      }
    ]
  },
  projects: {
    title: "Активные проекты",
    list: [
      {
        id: "project-1",
        title: "Редизайн веб-приложения",
        text: ["12 задач", "Дедлайн: 25 марта"],
        progress: {
          percent: 68
        },
        tag: {
          children: "В процессе"
        }
      },
      {
        id: "project-2",
        color: "green",
        title: "Маркетинговая кампания",
        text: ["8 задач", "Дедлайн: 15 апреля"],
        progress: {
          percent: 50
        },
        tag: {
          children: "В процессе"
        }
      },
      {
        id: "project-3",
        color: "orange",
        title: "Редизайн веб-приложения",
        text: ["12 задач", "Дедлайн: 25 марта"],
        progress: {
          percent: 15
        },
        tag: {
          children: "В процессе"
        }
      }
    ]
  },
  habits: {
    title: "Трекер привычек",
    list: [
      { icon: "AimOutlined", title: "Тренировка", done: true },
      { icon: "ReadOutlined", title: "Чтение", done: false },
      { icon: "AimOutlined", title: "Вода 2л", done: true },
      { icon: "AimOutlined", title: "Сон 8ч", done: true }
    ]
  },
  finance: {
    title: "Финансовый обзор",
    cards: [
      {
        label: "Доходы",
        title: "85 400 ₽",
        desc: "+12% к прошлому месяцу",
        color: "green"
      },
      {
        label: "Расходы",
        title: "42 150 ₽",
        desc: "-5% к прошлому месяцу",
        color: "red"
      },
      {
        label: "Баланс",
        title: "43 250 ₽",
        desc: "Отлично!",
        color: "blue"
      }
    ],
    list: [
      {
        title: "Жильё",
        value: "20 000 ₽",
        color: "purple"
      },
      {
        title: "Еда",
        value: "20 000 ₽",
        color: "volcano"
      },
      {
        title: "Транспорт",
        value: "6 000 ₽",
        color: "cyan"
      }
    ]
  }
};
const index$1 = UNSAFE_withComponentProps(function Dashboard({
  loaderData
}) {
  const {
    progress,
    statistics,
    fastActions,
    tasks,
    projects,
    habits,
    finance
  } = content$1;
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsxs(Row, {
      gutter: [16, 16],
      children: [/* @__PURE__ */ jsx(Col, {
        span: 8,
        children: /* @__PURE__ */ jsx(Progress, {
          ...progress
        })
      }), /* @__PURE__ */ jsx(Col, {
        span: 8,
        children: /* @__PURE__ */ jsx(Statistics, {
          ...statistics
        })
      }), /* @__PURE__ */ jsx(Col, {
        span: 8,
        children: /* @__PURE__ */ jsx(FastActions, {
          ...fastActions
        })
      }), /* @__PURE__ */ jsx(Col, {
        span: 12,
        children: /* @__PURE__ */ jsx(Tasks, {
          ...tasks
        })
      }), /* @__PURE__ */ jsx(Col, {
        span: 12,
        children: /* @__PURE__ */ jsx(Projects, {
          ...projects
        })
      }), /* @__PURE__ */ jsx(Col, {
        span: 8,
        children: /* @__PURE__ */ jsx(Habits, {
          ...habits
        })
      }), /* @__PURE__ */ jsx(Col, {
        span: 16,
        children: /* @__PURE__ */ jsx(Finance, {
          ...finance
        })
      })]
    })
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$1
}, Symbol.toStringTag, { value: "Module" }));
const content = {
  headController: {
    periodFilters: [
      { children: "Сегодня", id: "day" },
      { children: "Неделя", id: "week" },
      { children: "Месяц", id: "month" },
      { children: "Все", id: "all" }
    ],
    viewSettings: [
      { children: "Список", id: "day", iconName: "BarsOutlined" },
      { children: "Ячейки", id: "week", iconName: "AppstoreOutlined" }
    ]
  }
};
const HeadController = ({ periodFilters, viewSettings }) => {
  const [filters, setFilters] = useState({ periodId: periodFilters[0].id });
  const [settings, setSettings] = useState({ viewId: viewSettings[0].id });
  return /* @__PURE__ */ jsxs(Flex, { justify: "space-between", children: [
    /* @__PURE__ */ jsx(Flex, { gap: "small", children: periodFilters.map(({ children, id, iconName, ...rest }) => /* @__PURE__ */ jsx(
      Button,
      {
        variant: "filled",
        children,
        icon: iconName ? /* @__PURE__ */ jsx(Icon, { name: iconName }) : void 0,
        color: filters.periodId === id ? "blue" : "default",
        onClick: () => setFilters((p) => ({ ...p, periodId: id })),
        ...rest
      },
      id
    )) }),
    /* @__PURE__ */ jsx(Flex, { gap: "small", children: viewSettings.map(({ children, id, iconName, ...rest }) => /* @__PURE__ */ jsx(
      Button,
      {
        variant: "link",
        children,
        icon: iconName ? /* @__PURE__ */ jsx(Icon, { name: iconName }) : void 0,
        color: settings.viewId === id ? "blue" : "default",
        onClick: () => setSettings((p) => ({ ...p, viewId: id })),
        ...rest
      },
      id
    )) })
  ] });
};
const index = UNSAFE_withComponentProps(function Tasks2({}) {
  const {
    headController
  } = content;
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx(HeadController, {
      ...headController
    })
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-Beb2T1mp.js", "imports": ["/assets/chunk-UVKPFVEO-CSnOG_NG.js", "/assets/index-CimhCug3.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/root-C5GbtjWO.js", "imports": ["/assets/chunk-UVKPFVEO-CSnOG_NG.js", "/assets/index-CimhCug3.js", "/assets/useThemeToken-DGyI0EJM.js", "/assets/index-LR42v3hk.js"], "css": ["/assets/root-CulHfvvr.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/home": { "id": "pages/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/home-Zi6VmY7c.js", "imports": ["/assets/chunk-UVKPFVEO-CSnOG_NG.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/dashboard/index": { "id": "pages/dashboard/index", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/index-CujKiScQ.js", "imports": ["/assets/chunk-UVKPFVEO-CSnOG_NG.js", "/assets/useThemeToken-DGyI0EJM.js", "/assets/index-LR42v3hk.js", "/assets/index-CimhCug3.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/tasks/index": { "id": "pages/tasks/index", "parentId": "root", "path": "tasks", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/index-CRO_0bB_.js", "imports": ["/assets/chunk-UVKPFVEO-CSnOG_NG.js", "/assets/index-LR42v3hk.js", "/assets/index-CimhCug3.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-6a3c136b.js", "version": "6a3c136b", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_passThroughRequests": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "unstable_previewServerPrerendering": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "pages/home": {
    id: "pages/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "pages/dashboard/index": {
    id: "pages/dashboard/index",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "pages/tasks/index": {
    id: "pages/tasks/index",
    parentId: "root",
    path: "tasks",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
