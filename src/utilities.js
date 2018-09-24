import React from 'react';
import { asyncComponent } from "react-async-component";

export function withEverything(Component, fetchApi)
{
    var propsToComponent = props =>
    {
        const AsyncComponent = asyncComponent({
            resolve: async () =>
            {
                var fetchApiSubstitute = fetchApi;
                for (var paramName in props.match.params)
                {
                    fetchApiSubstitute = fetchApiSubstitute.replace(':' + paramName, props.match.params[paramName]);
                }
                var fetchReq = await fetch(fetchApiSubstitute);
                var fetchJson = await fetchReq.json();
                props.data = fetchJson;
                return (WrappedComponent =>
                {
                    class Hoc extends React.Component
                    {
                        render()
                        {
                            return <WrappedComponent {...props} />;
                        }
                    }
                    return Hoc;
                })(Component);
            }
        });
        return <AsyncComponent {...props} />;
    }
    return propsToComponent;
}