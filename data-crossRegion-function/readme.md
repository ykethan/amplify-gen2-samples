## Data Cross Region Function

> [!IMPORTANT]
> This is just a proof of concept.

Reference a function that is in a different region in Amplify Gen2 Data API.

Additional permissions were needed to create and read the stacks in the us-east-2 region.

> [!NOTE]
> Too permissive policy change this to a more restrictive policy.

```json
{
  "Effect": "Allow",
  "Action": [
    "cloudformation:DescribeStacks",
    "cloudformation:ListStacks",
    "cloudformation:CreateStack",
    "cloudformation:UpdateStack",
    "cloudformation:DeleteStack"
  ],
  "Resource": "*"
}
```
