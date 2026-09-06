"""Token 口径的输出限制工具：工具路由与 FileSystem 共用的统一上限计算"""

# 统一输出上限（token 口径）
DEFAULT_OUTPUT_TOKEN_LIMIT = 10000
MIN_OUTPUT_TOKEN_LIMIT = 500
# 动态模式（传入 available_tokens）下为模型上下文预留的余量
TOKEN_CONTEXT_RESERVE = 500

_ENCODER = None
_ENCODER_LOADED = False


def _get_encoder():
    """懒加载 tiktoken 编码器（失败时返回 None，走启发式估算兜底）"""
    global _ENCODER, _ENCODER_LOADED
    if not _ENCODER_LOADED:
        _ENCODER_LOADED = True
        try:
            import tiktoken

            _ENCODER = tiktoken.get_encoding("cl100k_base")
        except Exception as e:
            print(f"[Warn.TokenLimit] tiktoken 不可用，退化为启发式估算: {e}")
    return _ENCODER


def _heuristic_token_count(text: str) -> int:
    """启发式估算：CJK 字符按 ~1.5 token/字，其余按 ~4 字符/token（宁多勿少）"""
    cjk = sum(1 for ch in text if "\u4e00" <= ch <= "\u9fff")
    rest = len(text) - cjk
    return int(cjk * 1.5 + rest / 4) + 1


def count_tokens(text: str) -> int:
    """统计文本 token 数：优先 tiktoken（cl100k_base），失败退化启发式"""
    if not text:
        return 0
    enc = _get_encoder()
    if enc is not None:
        try:
            return len(enc.encode(text))
        except Exception:
            pass
    return _heuristic_token_count(text)


def truncate_to_tokens(text: str, max_tokens: int) -> str:
    """按 token 预算截断文本（启发式模式下按比例近似截断字符）"""
    if max_tokens <= 0 or not text:
        return ""
    enc = _get_encoder()
    if enc is not None:
        try:
            # errors="ignore"：丢弃被 token 边界切断的不完整多字节字符，保证结果是原文前缀
            return enc.decode(enc.encode(text)[:max_tokens], errors="ignore")
        except Exception:
            pass
    total = _heuristic_token_count(text)
    if total <= max_tokens:
        return text
    keep_chars = int(len(text) * max_tokens / total)
    return text[:keep_chars]


def get_output_token_limit(available_tokens: int = None) -> int:
    """统一的工具输出 token 上限：动态模式为剩余上下文减去预留余量"""
    if available_tokens is None:
        return DEFAULT_OUTPUT_TOKEN_LIMIT
    return min(
        DEFAULT_OUTPUT_TOKEN_LIMIT,
        max(MIN_OUTPUT_TOKEN_LIMIT, available_tokens - TOKEN_CONTEXT_RESERVE),
    )
