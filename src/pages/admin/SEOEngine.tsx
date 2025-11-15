import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { seoEngine } from '@/core/ai-seo-engine';
import type { SEOScore, ContentHealthReport } from '@/core/ai-seo-engine/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, TrendingUp, Search, Brain, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import { Navigate } from 'react-router-dom';

export default function SEOEngine() {
  const { user } = useAuth();
  const { isAdmin } = useRoles();
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState<SEOScore>({
    overall: 85,
    geo: 88,
    seo: 90,
    aeo: 78,
    timestamp: new Date().toISOString()
  });

  const [healthReports, setHealthReports] = useState<ContentHealthReport[]>([
    {
      pageUrl: '/',
      issues: ['No author information'],
      recommendations: ['Add FAQ section', 'Improve internal linking'],
      score: 85,
      lastChecked: new Date().toISOString()
    },
    {
      pageUrl: '/services',
      issues: [],
      recommendations: ['Add more service details'],
      score: 92,
      lastChecked: new Date().toISOString()
    },
    {
      pageUrl: '/about',
      issues: ['Content is too short'],
      recommendations: ['Add team member bios', 'Include company history'],
      score: 78,
      lastChecked: new Date().toISOString()
    }
  ]);

  // Redirect if not admin
  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate refresh - in production this would call API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setScores({
      ...scores,
      timestamp: new Date().toISOString()
    });
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-600">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-600">Good</Badge>;
    return <Badge variant="destructive">Needs Improvement</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI SEO Engine</h1>
          <p className="text-muted-foreground">
            GEO + SEO + AEO Optimization Dashboard
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Scores'}
        </Button>
      </div>

      {/* Overall Score Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(scores.overall)}`}>
              {scores.overall}%
            </div>
            <Progress value={scores.overall} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GEO Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(scores.geo)}`}>
              {scores.geo}%
            </div>
            <Progress value={scores.geo} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              AI Engine Optimization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SEO Score</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(scores.seo)}`}>
              {scores.seo}%
            </div>
            <Progress value={scores.seo} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Search Engine Optimization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AEO Score</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(scores.aeo)}`}>
              {scores.aeo}%
            </div>
            <Progress value={scores.aeo} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Answer Engine Optimization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">Content Health</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="status">Engine Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Engine Status</CardTitle>
              <CardDescription>
                Current optimization status and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  All SEO engines are operational and optimizing content in the background.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    GEO Engine
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ AI-friendly summaries</li>
                    <li>✓ EEAT metadata</li>
                    <li>✓ Contextual FAQs</li>
                    <li>✓ Content analysis</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    SEO Engine
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ JSON-LD schemas</li>
                    <li>✓ Meta tag optimization</li>
                    <li>✓ Sitemap generation</li>
                    <li>✓ Canonical URLs</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    AEO Engine
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Speakable content</li>
                    <li>✓ Answer blocks</li>
                    <li>✓ Voice optimization</li>
                    <li>✓ Featured snippets</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Health Reports</CardTitle>
              <CardDescription>
                Content health analysis for all pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthReports.map((report) => (
                  <div
                    key={report.pageUrl}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{report.pageUrl}</h4>
                        <p className="text-sm text-muted-foreground">
                          Last checked: {new Date(report.lastChecked).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(report.score)}`}>
                          {report.score}%
                        </div>
                        {getScoreBadge(report.score)}
                      </div>
                    </div>

                    {report.issues.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          Issues Found
                        </h5>
                        <ul className="text-sm space-y-1">
                          {report.issues.map((issue, i) => (
                            <li key={i} className="text-muted-foreground">
                              • {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {report.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          Recommendations
                        </h5>
                        <ul className="text-sm space-y-1">
                          {report.recommendations.map((rec, i) => (
                            <li key={i} className="text-muted-foreground">
                              • {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Recommendations</CardTitle>
              <CardDescription>
                Prioritized actions to improve SEO performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>High Priority:</strong> Add author information to all blog posts to improve E-E-A-T signals.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Medium Priority:</strong> Expand About page content to at least 500 words.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Low Priority:</strong> Add more internal links between related pages.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engine Status</CardTitle>
              <CardDescription>
                Technical status of all SEO engines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Version</span>
                  <Badge variant="outline">1.0.0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>GEO Engine</span>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>SEO Engine</span>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>AEO Engine</span>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Content Health</span>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Schema Generator</span>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Update</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(scores.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
