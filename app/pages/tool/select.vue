<template>
    <main class="main">
        <h2 class="tle">jQuery 选择器</h2>

        <table class="table">
            <tbody>
                <tr>
                    <th>选择器</th>
                    <th>实例</th>
                    <th>选取</th>
                </tr>

                <tr>
                    <td><a title="jQuery * 选择器">*</a></td>
                    <td>$("*")</td>
                    <td>所有元素</td>
                </tr>

                <tr>
                    <td>
                        <a title="jQuery # 选择器">#<i>id</i></a>
                    </td>
                    <td>$("#lastname")</td>
                    <td>id="lastname" 的元素</td>
                </tr>

                <tr>
                    <td>
                        <a title="jQuery . 选择器">.<i>class</i></a>
                    </td>
                    <td>$(".intro")</td>
                    <td>所有 class="intro" 的元素</td>
                </tr>

                <tr>
                    <td>
                        <a title="jQuery element 选择器"><i>element</i></a>
                    </td>
                    <td>$("p")</td>
                    <td>所有 &lt;p&gt; 元素</td>
                </tr>

                <tr>
                    <td>.<i>class</i>.<i>class</i></td>
                    <td>$(".intro.demo")</td>
                    <td>所有 class="intro" 且 class="demo" 的元素</td>
                </tr>

                <tr>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                </tr>

                <tr>
                    <td><a title="jQuery :first 选择器">:first</a></td>
                    <td>$("p:first")</td>
                    <td>第一个 &lt;p&gt; 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :last 选择器">:last</a></td>
                    <td>$("p:last")</td>
                    <td>最后一个 &lt;p&gt; 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :even 选择器">:even</a></td>
                    <td>$("tr:even")</td>
                    <td>所有偶数 &lt;tr&gt; 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :odd 选择器">:odd</a></td>
                    <td>$("tr:odd")</td>
                    <td>所有奇数 &lt;tr&gt; 元素</td>
                </tr>

                <tr>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                </tr>

                <tr>
                    <td><a title="jQuery :eq() 选择器">:eq(<i>index</i>)</a></td>
                    <td>$("ul li:eq(3)")</td>
                    <td>列表中的第四个元素（index 从 0 开始）</td>
                </tr>

                <tr>
                    <td><a title="jQuery :gt 选择器">:gt(<i>no</i>)</a></td>
                    <td>$("ul li:gt(3)")</td>
                    <td>列出 index 大于 3 的元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :lt 选择器">:lt(<i>no</i>)</a></td>
                    <td>$("ul li:lt(3)")</td>
                    <td>列出 index 小于 3 的元素</td>
                </tr>

                <tr>
                    <td>:not(<i>selector</i>)</td>
                    <td>$("input:not(:empty)")</td>
                    <td>所有不为空的 input 元素</td>
                </tr>

                <tr>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                </tr>

                <tr>
                    <td><a title="jQuery :header 选择器">:header</a></td>
                    <td>$(":header")</td>
                    <td>所有标题元素 &lt;h1&gt; - &lt;h6&gt;</td>
                </tr>

                <tr>
                    <td><a title="jQuery :animated 选择器">:animated</a></td>
                    <td>&nbsp;</td>
                    <td>所有动画元素</td>
                </tr>

                <tr>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                </tr>

                <tr>
                    <td><a title="jQuery :contains 选择器">:contains(<i>text</i>)</a></td>
                    <td>$(":contains('W3School')")</td>
                    <td>包含指定字符串的所有元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :empty 选择器">:empty</a></td>
                    <td>$(":empty")</td>
                    <td>无子（元素）节点的所有元素</td>
                </tr>

                <tr>
                    <td>:hidden</td>
                    <td>$("p:hidden")</td>
                    <td>所有隐藏的 &lt;p&gt; 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :visible 选择器">:visible</a></td>
                    <td>$("table:visible")</td>
                    <td>所有可见的表格</td>
                </tr>

                <tr>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                </tr>

                <tr>
                    <td>s1,s2,s3</td>
                    <td>$("th,td,.intro")</td>
                    <td>所有带有匹配选择的元素</td>
                </tr>

                <tr>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                </tr>

                <tr>
                    <td><a title="jQuery [attribute] 选择器">[<i>attribute</i>]</a></td>
                    <td>$("[href]")</td>
                    <td>所有带有 href 属性的元素</td>
                </tr>

                <tr>
                    <td>
                        <a title="jQuery [attribute=value] 选择器">[<i>attribute</i>=<i>value</i>]</a>
                    </td>
                    <td>$("[href='#']")</td>
                    <td>所有 href 属性的值等于 "#" 的元素</td>
                </tr>

                <tr>
                    <td>
                        <a title="jQuery [attribute!=value] 选择器">[<i>attribute</i>!=<i>value</i>]</a>
                    </td>
                    <td>$("[href!='#']")</td>
                    <td>所有 href 属性的值不等于 "#" 的元素</td>
                </tr>

                <tr>
                    <td>
                        <a title="jQuery [attribute$=value] 选择器">[<i>attribute</i>$=<i>value</i>]</a>
                    </td>
                    <td>$("[href$='.jpg']")</td>
                    <td>所有 href 属性的值包含以 ".jpg" 结尾的元素</td>
                </tr>

                <tr>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                </tr>

                <tr>
                    <td><a title="jQuery :input 选择器">:input</a></td>
                    <td>$(":input")</td>
                    <td>所有 &lt;input&gt; 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :text 选择器">:text</a></td>
                    <td>$(":text")</td>
                    <td>所有 type="text" 的 &lt;input&gt; 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :password 选择器">:password</a></td>
                    <td>$(":password")</td>
                    <td>所有 type="password" 的 &lt;input&gt; 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :radio 选择器">:radio</a></td>
                    <td>$(":radio")</td>
                    <td>所有 type="radio" 的 &lt;input&gt; 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :checkbox 选择器">:checkbox</a></td>
                    <td>$(":checkbox")</td>
                    <td>所有 type="checkbox" 的 &lt;input&gt; 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :submit 选择器">:submit</a></td>
                    <td>$(":submit")</td>
                    <td>所有 type="submit" 的 &lt;input&gt; 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :reset 选择器">:reset</a></td>
                    <td>$(":reset")</td>
                    <td>所有 type="reset" 的 &lt;input&gt; 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :button 选择器">:button</a></td>
                    <td>$(":button")</td>
                    <td>所有 type="button" 的 &lt;input&gt; 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :image 选择器">:image</a></td>
                    <td>$(":image")</td>
                    <td>所有 type="image" 的 &lt;input&gt; 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :file 选择器">:file</a></td>
                    <td>$(":file")</td>
                    <td>所有 type="file" 的 &lt;input&gt; 元素</td>
                </tr>

                <tr>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                    <td style="background-color: #fff">&nbsp;</td>
                </tr>

                <tr>
                    <td><a title="jQuery :enabled 选择器">:enabled</a></td>
                    <td>$(":enabled")</td>
                    <td>所有激活的 input 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :disabled 选择器">:disabled</a></td>
                    <td>$(":disabled")</td>
                    <td>所有禁用的 input 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :selected 选择器">:selected</a></td>
                    <td>$(":selected")</td>
                    <td>所有被选取的 input 元素</td>
                </tr>

                <tr>
                    <td><a title="jQuery :checked 选择器">:checked</a></td>
                    <td>$(":checked")</td>
                    <td>所有被选中的 input 元素</td>
                </tr>
            </tbody>
        </table>
        <div style="margin: 20px 0; font-size: 20px">
            <a href="https://www.w3school.com.cn/jquery/jquery_ref_selectors.asp" target="_blank">
                jQuery 参考手册 -
                选择器https://www.w3school.com.cn/jquery/jquery_ref_selectors.asp </a><br />
            <a href="https://www.w3school.com.cn/cssref/css_selectors.asp" target="_blank">
                CSS 参考手册 -
                选择器https://www.w3school.com.cn/cssref/css_selectors.asp </a><br />
        </div>
    </main>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.main {
    width: 1100px;
    padding: 15px;
    max-width: 100%;
    margin: 0 auto;

    &>.tle {
        padding: 10px 0 20px;
    }

    a:hover {
        color: #f00;
    }
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th {
    vertical-align: baseline;
    padding: 10px 10px 10px 10px;
    background-color: #3f3f3f;
    border: 1px solid #3f3f3f;
    text-align: left;
    color: #fff;
}

.table td {
    vertical-align: text-top;
    padding: 9px 9px 9px 9px;
    border: 1px solid #aaa;
}

.table tr {
    background-color: #fff;
}

.table tr:nth-child(2n) {
    background-color: #f5f5f5;
}
</style>
